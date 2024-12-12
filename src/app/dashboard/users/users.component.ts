import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { IEmitAction, ITable, ITableHeaders } from 'src/app/core/models/common';
import { ButtonAction, RoleActionEvent } from 'src/app/core/models/enum';
import { IRole, IRoleAction } from 'src/app/core/models/roles';
import {
  ISavedUserRole,
  IUpsertUser,
  IUserAction,
  IUserEventsInfo,
} from 'src/app/core/models/users';
import { LoaderService } from 'src/app/core/services/loader.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {
  users: IUserEventsInfo[] = [];
  userAction!: IUserAction;
  roleSelected: IRole | undefined = undefined;
  savedUser: IUpsertUser | undefined = undefined;
  table: ITable = {
    headers: [] as ITableHeaders[],
    data: [] as { [key: string]: string }[],
  } as ITable;

  constructor(
    private usersService: UsersService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize`Cargando usuarios`);

    this.usersService
      .getAllUsers()
      .subscribe({
        next: (users) => {
          this.users = users;
          this.table = this.getTableConfiguration(users);
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  updateUsers(userAction: IUserAction) {
    const userInfo = userAction.user;
    const userEventsInfo = {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      isActive: userAction.isNew ? true : userInfo.isActive,
    } as IUserEventsInfo;

    if (userAction.isNew) {
      this.users = this.users.concat({
        ...userEventsInfo,
        numEntries: 0,
        numEvents: 0,
      });
    } else {
      this.users = this.users.map((originalUser) =>
        originalUser.id === userInfo.id
          ? {
              ...userEventsInfo,
              numEntries: originalUser.numEntries,
              numEvents: originalUser.numEvents,
            }
          : originalUser
      );
    }
    this.users.sort((a, b) =>
      a.username.toLowerCase().localeCompare(b.username.toLowerCase())
    );

    this.table = this.getTableConfiguration(this.users);
  }

  editUser(userId: string): void {
    this.usersService
      .getUserById(userId)
      .subscribe({
        next: (user) => {
          this.userAction = {
            user: {
              ...user,
              roles: user.roles.map((r) => r.id),
            },
            isNew: false,
          };

          $('#usersModal').modal('show');
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  setSelectedRole(savedUser: ISavedUserRole): void {
    this.roleSelected = savedUser.role;
    this.savedUser = savedUser.savedUser;
  }

  updateSavedInformation(roleAction: IRoleAction): void {
    // This means that the we are updating an active user
    if (
      (roleAction.action === RoleActionEvent.Update ||
        roleAction.action === RoleActionEvent.None) &&
      this.savedUser
    ) {
      this.userAction = {
        isNew: false,
        user: {
          id: this.savedUser.id,
          email: this.savedUser.email,
          username: this.savedUser.username,
          roles: this.savedUser.roles,
          isActive: this.savedUser.isActive,
        },
      };
      $('#usersModal').modal('show');
    }
  }

  actionResponse(action: IEmitAction): void {
    const data = action.data as { [key: string]: string };
    const userId = data[$localize`Acciones`];
    if (action.action === ButtonAction.Edit) {
      this.editUser(userId);
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
          styles: 'background-color: #FFC107;',
        },
        {
          isDisabled: false,
          accessibleText: $localize`Ver log`,
          action: ButtonAction.View,
          innerHtml: '<i class="fa-solid fa-eye" aria-hidden="true"></i>',
          styles: 'background-color: #ADB5BD;',
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
