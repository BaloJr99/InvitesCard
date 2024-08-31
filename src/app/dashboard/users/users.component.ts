import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { IUserAction, IUserEventsInfo } from 'src/app/core/models/users';
import { LoaderService } from 'src/app/core/services/loader.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  dtOptions: ADTSettings = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dtTrigger: Subject<any> = new Subject<any>();

  users: IUserEventsInfo[] = [];
  userAction!: IUserAction;

  constructor (
    private usersService: UsersService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      searching: false,
      destroy: true,
      language: {
        lengthMenu: '_MENU_'
      },
      columnDefs: [
        {
          className: 'dt-head-center',
          targets: "_all"
        }
      ]
    }

    this.loaderService.setLoading(true, 'Cargando usuarios');

    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.rerender();
      }
    }).add(() => {
      this.loaderService.setLoading(false, '');
    })
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(false)
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  updateUsers(userAction: IUserAction) {
    const userInfo = userAction.user;
    const userEventsInfo = {
      id: userInfo._id,
      username: userInfo.username,
      email: userInfo.email,
      isActive: userAction.isNew ? true : userInfo.isActive,
      numEntries: 0,
      numEvents: 0,
    } as IUserEventsInfo;

    if (userAction.isNew) {
      this.users.push(userEventsInfo);
      this.rerender();
    } else {
      this.users = this.users.map(originalUser => originalUser.id === userAction.user._id ? userEventsInfo : originalUser);
    }
    this.users.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
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
      this.loaderService.setLoading(false, '');
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.destroy();
    });
    this.dtTrigger.next(false);
  }
}
