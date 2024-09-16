import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { IUserAction, IUserEventsInfo } from 'src/app/core/models/users';
import { LoaderService } from 'src/app/core/services/loader.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

  dtOptions: ADTSettings = {
    searching: false,
    destroy: true,
    language: {
      lengthMenu: '_MENU_'
    },
    columnDefs: [
      {
        className: 'text-center',
        targets: "_all"
      }
    ],
    columns: [
      { title: $localize `Usuario`, data: 'username' },
      { title: $localize `Correo`, data: 'email' },
      { title: $localize `# Entradas`, data: 'numEntries' },
      { title: $localize `# Eventos`, data: 'numEvents' },
      { title: $localize `Activo`, 
        render(data, type, row) {
          return `<i class="fa-solid ${row.isActive ? 'fa-circle-check' : 'fa-circle-xmark'}" aria-hidden="true"></i>`;
        }
      },
      { title: $localize `Acciones`, data: 'id',
        render(data) {
          return `<button class="btn btn-secondary edit-btn" data-id="${data}" data-bs-toggle="modal" data-bs-target="#usersModal"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></button>`;
        }
      }
    ]
  };

  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  
  userAction!: IUserAction;

  constructor (
    private usersService: UsersService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize `Cargando usuarios`);

    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.dtOptions.data = users;
        this.rerender();
      }
    }).add(() => {
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
      numEntries: 0,
      numEvents: 0,
    } as IUserEventsInfo;

    if (userAction.isNew) {
      this.dtOptions.data = this.dtOptions.data?.concat(userEventsInfo);
      this.rerender();
    } else {
      this.dtOptions.data = this.dtOptions.data?.map(originalUser => originalUser.id === userInfo.id ? userEventsInfo : originalUser);
    }
    this.dtOptions.data?.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
  }

  editUser(userId: string): void {
    this.usersService.getUserById(userId).subscribe({
      next: (user) => {
        this.userAction = {
          user,
          isNew: false
        }
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.destroy();
    });

    this.dtTrigger.next(this.dtOptions);
  }
}