import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { UsersService } from 'src/app/core/services/users.service';
import { UserModalComponent } from 'src/app/dashboard/users/user-modal/user-modal.component';
import { UserRoleComponent } from 'src/app/dashboard/users/user-role-modal/user-role.component';
import { UsersComponent } from 'src/app/dashboard/users/users.component';
import { FilterComponent } from 'src/app/shared/components/table/filter/filter.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { searchUserMock, userEventsInfoMock } from 'src/tests/mocks/mocks';

const searchUserMockCopy = deepCopy(searchUserMock);
const userEventsInfoMockCopy = deepCopy(userEventsInfoMock);

describe('Users Component (Integrated Test)', () => {
  let fixture: ComponentFixture<UsersComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const usersSpy = jasmine.createSpyObj('UsersService', [
      'getAllUsers',
      'getUserById',
    ]);
    const rolesSpy = jasmine.createSpyObj('RolesService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [
        FilterComponent,
        TableComponent,
        UserModalComponent,
        UserRoleComponent,
        UsersComponent,
      ],
      imports: [ReactiveFormsModule, ValidationPipe, ValidationErrorPipe],
      providers: [
        { provide: UsersService, useValue: usersSpy },
        { provide: RolesService, useValue: rolesSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    usersServiceSpy.getAllUsers.and.returnValue(of([userEventsInfoMockCopy]));
    usersServiceSpy.getUserById.and.returnValue(of(searchUserMockCopy));
    fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();
  });

  it('should have a table with one row and correct values', () => {
    const appTable = fixture.debugElement.query(By.css('app-table'));
    const tableRows = appTable.queryAll(By.css('tbody tr'));
    const columns = tableRows[0].queryAll(By.css('td'));

    expect(tableRows.length).withContext('table should have one row').toBe(1);

    expect(columns[0].nativeElement.textContent)
      .withContext('first column should be the user name')
      .toBe(userEventsInfoMockCopy.username);

    expect(columns[1].nativeElement.textContent)
      .withContext('second column should be the user email')
      .toBe(userEventsInfoMockCopy.email);

    expect(columns[2].nativeElement.textContent)
      .withContext('third column should be the user role')
      .toBe(userEventsInfoMockCopy.numEntries.toString());

    expect(columns[3].nativeElement.textContent)
      .withContext('fourth column should be the user status')
      .toBe(userEventsInfoMockCopy.numEvents.toString());

    expect(columns[4].nativeElement.innerHTML)
      .withContext('fifth column should be the user actions')
      .toBe('<i class="fa-solid fa-circle-check" aria-hidden="true"></i>');

    const actionButtons = columns[5].queryAll(By.css('button'));

    expect(actionButtons.length)
      .withContext('sixth column should have two buttons')
      .toBe(2);

    expect(actionButtons[0].nativeElement.innerHTML)
      .withContext('first button should be the edit button')
      .toBe('<i class="fa-solid fa-pencil" aria-hidden="true"></i>');

    expect(actionButtons[1].nativeElement.innerHTML)
      .withContext('first button should be the edit button')
      .toBe('<i class="fa-solid fa-eye" aria-hidden="true"></i>');
  });

  it('should call getUserById when edit button is clicked', () => {
    const appTable = fixture.debugElement.query(By.css('app-table'));
    const tableRows = appTable.queryAll(By.css('tbody tr'));
    const columns = tableRows[0].queryAll(By.css('td'));
    const editButton = columns[5].queryAll(By.css('button'))[0];
    editButton.nativeElement.click();

    expect(usersServiceSpy.getUserById)
      .withContext('getUserById should have been called')
      .toHaveBeenCalled();
  });

  it('should navigate to /dashboard/profile when profile button is clicked', () => {
    spyOn(router, 'navigate');

    const appTable = fixture.debugElement.query(By.css('app-table'));
    const tableRows = appTable.queryAll(By.css('tbody tr'));
    const columns = tableRows[0].queryAll(By.css('td'));
    const editButton = columns[5].queryAll(By.css('button'))[1];
    editButton.nativeElement.click();

    expect(router.navigate)
      .withContext('getUserById should have been called')
      .toHaveBeenCalledWith(['/dashboard/profile', userEventsInfoMockCopy.id]);
  });
});
