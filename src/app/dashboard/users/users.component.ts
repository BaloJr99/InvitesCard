import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { RoleActionEvent } from 'src/app/core/models/enum';
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
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtOptions: ADTSettings = {
    searching: false,
    destroy: true,
    language: {
      lengthMenu: '_MENU_',
    },
    columnDefs: [
      {
        className: 'text-center',
        targets: '_all',
      },
    ],
    columns: [
      { title: $localize`Usuario`, data: 'username' },
      { title: $localize`Correo`, data: 'email' },
      { title: $localize`# Pases`, data: 'numEntries' },
      { title: $localize`# Eventos`, data: 'numEvents' },
      {
        title: $localize`Activo`,
        render(data, type, row) {
          return `<i class="fa-solid ${
            row.isActive ? 'fa-circle-check' : 'fa-circle-xmark'
          }" aria-hidden="true"></i>`;
        },
      },
      {
        title: $localize`Acciones`,
        data: 'id',
        render(data) {
          return `<button class="btn btn-secondary edit-btn" data-id="${data}" data-bs-toggle="modal" data-bs-target="#usersModal"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></button>
                  <button class="btn btn-success show-btn" data-id="${data}"><i class="fa-solid fa-user" aria-hidden="true"></i></button>`;
        },
      },
    ],
  };

  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

  userAction!: IUserAction;
  roleSelected: IRole | undefined = undefined;
  savedUser: IUpsertUser | undefined = undefined;

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
          this.dtOptions.data = users;
          this.rerender();
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);

    // Delegate click event for edit buttons
    $(document).on('click', '.edit-btn', (event) => {
      const userId = $(event.currentTarget).data('id');
      this.editUser(userId);
    });

    $(document).on('click', '.show-btn', (event) => {
      const userId = $(event.currentTarget).data('id');
      this.router.navigate(['/dashboard/profile', userId]);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
      this.dtOptions.data = this.dtOptions.data?.concat({
        ...userEventsInfo,
        numEntries: 0,
        numEvents: 0,
      });
      this.rerender();
    } else {
      this.dtOptions.data = this.dtOptions.data?.map((originalUser) =>
        originalUser.id === userInfo.id
          ? {
              ...userEventsInfo,
              numEntries: originalUser.numEntries,
              numEvents: originalUser.numEvents,
            }
          : originalUser
      );
      this.rerender();
    }
    this.dtOptions.data?.sort((a, b) =>
      a.username.toLowerCase().localeCompare(b.username.toLowerCase())
    );
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
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.destroy();
    });

    this.dtTrigger.next(this.dtOptions);
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
      }
      $('#usersModal').modal('show');
    }
  }
}
