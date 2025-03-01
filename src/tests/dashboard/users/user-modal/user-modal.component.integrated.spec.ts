import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { UsersService } from 'src/app/core/services/users.service';
import { UserModalComponent } from 'src/app/dashboard/users/user-modal/user-modal.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  messageResponseMock,
  roleMock,
  upsertUserMock,
} from 'src/tests/mocks/mocks';

const messageResponseMockCopy = deepCopy(messageResponseMock);
const roleMockCopy = deepCopy(roleMock);
const upsertUserMockCopy = deepCopy(upsertUserMock);

describe('User Modal Component (Integrated Test)', () => {
  let fixture: ComponentFixture<UserModalComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let rolesServiceSpy: jasmine.SpyObj<RolesService>;

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

  beforeEach(async () => {
    const usersSpy = jasmine.createSpyObj('UsersService', [
      'createUser',
      'updateUser',
      'checkUsername',
    ]);
    const rolesSpy = jasmine.createSpyObj('RolesService', ['getAllRoles']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ValidationPipe,
        ValidationErrorPipe,
        UserModalComponent,
      ],
      providers: [
        { provide: UsersService, useValue: usersSpy },
        { provide: RolesService, useValue: rolesSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
    rolesServiceSpy = TestBed.inject(
      RolesService
    ) as jasmine.SpyObj<RolesService>;

    usersServiceSpy.createUser.and.returnValue(of(messageResponseMockCopy));
    usersServiceSpy.updateUser.and.returnValue(of(messageResponseMockCopy));
    usersServiceSpy.checkUsername.and.returnValue(of(false));
    rolesServiceSpy.getAllRoles.and.returnValue(of([roleMockCopy]));

    fixture = TestBed.createComponent(UserModalComponent);
    fixture.componentRef.setInput('userActionValue', {
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

    fixture.componentRef.setInput('showModalValue', true);
    fixture.detectChanges();
  });

  it('should call createUser()', () => {
    updateFormUsingEvent(
      '',
      upsertUserMockCopy.username,
      upsertUserMockCopy.email,
      upsertUserMockCopy.roles[0],
      upsertUserMockCopy.isActive
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
      upsertUserMockCopy.id,
      upsertUserMockCopy.username,
      upsertUserMockCopy.email,
      upsertUserMockCopy.roles[0],
      upsertUserMockCopy.isActive
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
