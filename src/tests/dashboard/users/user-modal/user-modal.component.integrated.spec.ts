import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { UsersService } from 'src/app/core/services/users.service';
import { UserModalComponent } from 'src/app/dashboard/users/user-modal/user-modal.component';
import {
  messageResponseMock,
  roleMock,
  upsertUserMock,
} from 'src/tests/mocks/mocks';

describe('User Modal Component (Integrated Test)', () => {
  let fixture: ComponentFixture<UserModalComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  const updateFormUsingEvent = (
    id: string,
    username: string,
    email: string,
    role: string,
    isActive: boolean
  ) => {
    fixture.componentInstance.createUserForm.patchValue({
      id,
    });

    const usernameInput = fixture.debugElement.query(By.css('#username'));
    const emailInput = fixture.debugElement.query(By.css('#email'));
    const roleFilterInput = fixture.debugElement.query(By.css('#roleFilter'));
    const userIsActiveInput = fixture.debugElement.query(
      By.css('#userIsActive')
    );

    usernameInput.nativeElement.value = username;
    usernameInput.nativeElement.dispatchEvent(new Event('input'));
    usernameInput.nativeElement.dispatchEvent(new Event('keyup'));

    emailInput.nativeElement.value = email;
    emailInput.nativeElement.dispatchEvent(new Event('input'));

    roleFilterInput.nativeElement.value = role;
    roleFilterInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const roleActions = fixture.debugElement.query(By.css('.roleActions'));
    const buttons = roleActions.queryAll(By.css('button'));
    if (buttons.length > 0) {
      const addRole = buttons[1];
      addRole.nativeElement.click();
    }

    userIsActiveInput.nativeElement.checked = isActive;
    userIsActiveInput.nativeElement.dispatchEvent(new Event('change'));
  };

  beforeEach(waitForAsync(() => {
    const usersSpy = jasmine.createSpyObj('UsersService', [
      'createUser',
      'updateUser',
      'checkUsername',
    ]);
    const rolesSpy = jasmine.createSpyObj('RolesService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [UserModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UsersService, useValue: usersSpy },
        { provide: RolesService, useValue: rolesSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
  }));

  beforeEach(() => {
    usersServiceSpy.createUser.and.returnValue(of(messageResponseMock));
    usersServiceSpy.updateUser.and.returnValue(of(messageResponseMock));
    usersServiceSpy.checkUsername.and.returnValue(of(false));

    fixture = TestBed.createComponent(UserModalComponent);
    fixture.componentInstance.roles = [roleMock];
    fixture.componentInstance.filteredRoles = [roleMock];
    fixture.detectChanges();
  });

  it('should call createUser()', () => {
    updateFormUsingEvent(
      '',
      upsertUserMock.username,
      upsertUserMock.email,
      upsertUserMock.roles[0],
      upsertUserMock.isActive
    );

    const buttons = fixture.debugElement.queryAll(
      By.css('.modal-footer button')
    );
    const saveButton = buttons[1];
    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(usersServiceSpy.createUser)
      .withContext("createUser method from UsersService should've been called")
      .toHaveBeenCalled();
  });

  it('should call updateUser()', () => {
    updateFormUsingEvent(
      upsertUserMock.id,
      upsertUserMock.username,
      upsertUserMock.email,
      upsertUserMock.roles[0],
      upsertUserMock.isActive
    );

    const buttons = fixture.debugElement.queryAll(
      By.css('.modal-footer button')
    );
    const saveButton = buttons[1];
    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(usersServiceSpy.updateUser)
      .withContext("updateUser method from UsersService should've been called")
      .toHaveBeenCalled();
  });
});