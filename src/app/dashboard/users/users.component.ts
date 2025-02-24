import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map, mergeMap, tap } from 'rxjs';
import { IEmitAction, ITable, ITableHeaders } from 'src/app/core/models/common';
import { ButtonAction, RoleActionEvent } from 'src/app/core/models/enum';
import { IRole, IRoleAction } from 'src/app/core/models/roles';
import {
  ISavedUserRole,
  IUpsertUser,
  IUserAction,
  IUserEventsInfo,
} from 'src/app/core/models/users';
import { UsersService } from 'src/app/core/services/users.service';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../shared/components/table/table.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { UserRoleComponent } from './user-role-modal/user-role.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    TableComponent,
    UserModalComponent,
    UserRoleComponent,
  ],
})
export class UsersComponent {
  private users = new BehaviorSubject<IUserEventsInfo[]>([]);
  users$ = this.users.asObservable();

  private userAction = new BehaviorSubject<IUserAction>({
    isNew: undefined,
    user: {
      id: '',
      username: '',
      email: '',
      roles: [],
      isActive: true,
    },
    roleChanged: undefined,
  } as IUserAction);
  userAction$ = this.userAction.asObservable();

  private roleAction = new BehaviorSubject<IRoleAction>({
    action: RoleActionEvent.None,
    role: {
      id: '',
      name: '',
      isActive: true,
    },
  });
  roleAction$ = this.roleAction.asObservable();

  showUserModal = false;
  showRoleModal = false;
  private refreshRoles = new BehaviorSubject<boolean>(false);
  refreshRoles$ = this.refreshRoles.asObservable();

  roleSelected: IRole | undefined = undefined;
  savedUser: IUpsertUser | undefined = undefined;

  constructor(private usersService: UsersService, private router: Router) {}

  vm$ = this.usersService.getAllUsers().pipe(
    tap((allUsers) => this.users.next(allUsers)),
    mergeMap(() =>
      combineLatest([this.users$, this.userAction$, this.roleAction$]).pipe(
        map(([users, userAction, roleAction]) => {
          const table = this.getTableConfiguration(users);

          return {
            table,
            userAction,
            roleAction,
          };
        })
      )
    )
  );

  updateUsers(userAction: IUserAction) {
    const userInfo = userAction.user;

    const userEventsInfo = {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      isActive: userAction.isNew ? true : userInfo.isActive,
    } as IUserEventsInfo;

    const oldUsers = this.users.getValue();

    if (userAction.isNew) {
      oldUsers.push({
        ...userEventsInfo,
        numEntries: 0,
        numEvents: 0,
      });
    } else {
      const userIndex = oldUsers.findIndex((u) => u.id === userInfo.id);
      oldUsers[userIndex] = {
        ...userEventsInfo,
        numEntries: oldUsers[userIndex].numEntries,
        numEvents: oldUsers[userIndex].numEvents,
      };
    }

    oldUsers.sort((a, b) =>
      a.username.toLowerCase().localeCompare(b.username.toLowerCase())
    );

    this.users.next(oldUsers);

    this.showUserModal = false;
  }

  openUserModal(userId: string): void {
    if (userId === '') {
      this.savedUser = undefined;
      this.userAction.next({
        user: {
          id: '',
          username: '',
          email: '',
          isActive: true,
          roles: [],
        },
        isNew: true,
        roleChanged: undefined,
      });

      this.showUserModal = true;
    } else {
      this.usersService.getUserById(userId).subscribe({
        next: (user) => {
          this.userAction.next({
            user: {
              ...user,
              roles: user.roles.map((r) => r.id),
            },
            isNew: false,
            roleChanged: undefined,
          });

          this.showUserModal = true;
        },
      });
    }
  }

  openRoleModal(role: IRole | undefined): void {
    if (role) {
      this.roleAction.next({
        action: RoleActionEvent.Update,
        role: role,
      });
    } else {
      this.roleAction.next({
        action: RoleActionEvent.Create,
        role: {
          id: '',
          name: '',
          isActive: true,
        },
      });
    }

    this.showRoleModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
  }

  closeRoleModal(): void {
    this.showRoleModal = false;
  }

  setSelectedRole(savedUser: ISavedUserRole): void {
    this.savedUser = savedUser.savedUser;
    this.closeUserModal();
    this.openRoleModal(savedUser.role);
  }

  updateSavedInformation(roleAction: IRoleAction): void {
    this.showRoleModal = false;

    if (this.savedUser && roleAction.action === RoleActionEvent.Update) {
      this.userAction.next({
        isNew: false,
        user: {
          id: this.savedUser.id,
          email: this.savedUser.email,
          username: this.savedUser.username,
          roles: this.savedUser.roles,
          isActive: this.savedUser.isActive,
        },
        roleChanged: roleAction.role,
      });
      this.showUserModal = true;
    }
  }

  actionResponse(action: IEmitAction): void {
    const data = action.data as { [key: string]: string };
    const userId = data[$localize`Acciones`];
    if (action.action === ButtonAction.Edit) {
      this.openUserModal(userId);
    } else if (action.action === ButtonAction.View) {
      this.router.navigate(['/dashboard/profile', userId]);
    }
  }

  getTableConfiguration(users: IUserEventsInfo[]): ITable {
    const headers = this.getHeaders();

    return {
      tableId: 'usersTable',
      headers: headers,
      data: users.map((user) => {
        return this.getUserRow(user, headers);
      }),
      buttons: [
        {
          isDisabled: false,
          accessibleText: $localize`Editar usuario`,
          action: ButtonAction.Edit,
          innerHtml: '<i class="fa-solid fa-pencil" aria-hidden="true"></i>',
          class: 'btn-warning',
        },
        {
          isDisabled: false,
          accessibleText: $localize`Ver log`,
          action: ButtonAction.View,
          innerHtml: '<i class="fa-solid fa-eye" aria-hidden="true"></i>',
          class: 'btn-secondary',
        },
      ],
      useCheckbox: false,
      tableIndex: 0,
    };
  }

  getHeaders(): ITableHeaders[] {
    return [
      {
        text: $localize`Usuario`,
        sortable: true,
        filterable: true,
      },
      {
        text: $localize`Correo`,
        sortable: true,
        filterable: true,
      },
      {
        text: $localize`# Pases`,
        sortable: true,
        filterable: true,
      },
      {
        text: $localize`# Eventos`,
        sortable: true,
        filterable: true,
      },
      {
        text: $localize`Activo`,
        sortable: true,
        filterable: true,
      },
      {
        text: $localize`Acciones`,
      },
    ];
  }

  getUserRow(
    user: IUserEventsInfo,
    headers: ITableHeaders[]
  ): { [key: string]: string } {
    const row: { [key: string]: string } = {};

    headers.forEach(({ text }) => {
      switch (text) {
        case $localize`Usuario`:
          row[text] = user.username;
          break;
        case $localize`Correo`:
          row[text] = user.email;
          break;
        case $localize`# Pases`:
          row[text] = user.numEntries.toString();
          break;
        case $localize`# Eventos`:
          row[text] = user.numEvents.toString();
          break;
        case $localize`Activo`:
          row[text] = user.isActive
            ? '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>';
          break;
        default:
          row[text] = user.id;
          break;
      }
    });

    return row;
  }
}
