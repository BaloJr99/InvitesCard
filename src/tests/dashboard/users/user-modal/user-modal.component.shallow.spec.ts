import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { UsersService } from 'src/app/core/services/users.service';
import { UserModalComponent } from 'src/app/dashboard/users/user-modal/user-modal.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { roleMock, upsertUserMock } from 'src/tests/mocks/mocks';

const roleMockCopy = deepCopy(roleMock);
const upsertUserMockCopy = deepCopy(upsertUserMock);

describe('User Modal Component (Shallow Test)', () => {
  let fixture: ComponentFixture<UserModalComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  const updateFormUsingEvent = (
    username: string,
    email: string,
    role: string,
    isActive: boolean
  ) => {
    const usernameInput = fixture.debugElement.query(By.css('#username'));
    const emailInput = fixture.debugElement.query(By.css('#email'));
    const roleFilterInput = fixture.debugElement.query(By.css('#roleFilter'));
    const userIsActiveInput = fixture.debugElement.query(
      By.css('#userIsActive')
    );

    usernameInput.nativeElement.value = username;
    usernameInput.nativeElement.dispatchEvent(new Event('input'));

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
    const usersSpy = jasmine.createSpyObj('UsersService', ['createUser']);
    const rolesSpy = jasmine.createSpyObj('RolesService', ['getAllRoles']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [UserModalComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
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
    usersServiceSpy.createUser.and.returnValue(of());
    fixture = TestBed.createComponent(UserModalComponent);
    fixture.componentInstance.roles = [roleMockCopy];
    fixture.componentInstance.filteredRoles = [roleMockCopy];
    fixture.detectChanges();
  });

  it('created a form with username, email, roleFilter, userIsActive, save button, cancel button', () => {
    const usernameInput = fixture.debugElement.query(By.css('#username'));
    const emailInput = fixture.debugElement.query(By.css('#email'));
    const roleFilterInput = fixture.debugElement.query(By.css('#roleFilter'));
    const userIsActiveInput = fixture.debugElement.query(
      By.css('#userIsActive')
    );

    const buttons = fixture.debugElement.queryAll(
      By.css('.modal-footer button')
    );
    const cancelButton = buttons[0];
    const saveButton = buttons[1];

    expect(usernameInput)
      .withContext("UsernameInput input shouldn't be null")
      .not.toBeNull();
    expect(emailInput)
      .withContext("Email input shouldn't be null")
      .not.toBeNull();
    expect(roleFilterInput)
      .withContext("RoleFilter input shouldn't be null")
      .not.toBeNull();
    expect(userIsActiveInput)
      .withContext("UserIsActive input shouldn't be null")
      .not.toBeNull();
    expect(saveButton)
      .withContext("Save button shouldn't be null")
      .not.toBeNull();
    expect(cancelButton)
      .withContext("Cancel button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(
      upsertUserMockCopy.username,
      upsertUserMockCopy.email,
      upsertUserMockCopy.roles[0],
      upsertUserMockCopy.isActive
    );

    const controls = fixture.componentInstance.createUserForm.controls;
    expect(controls['username'].value)
      .withContext('Username control should be filled')
      .toBe(upsertUserMockCopy.username);

    expect(controls['email'].value)
      .withContext('Email control should be filled')
      .toBe(upsertUserMockCopy.email);

    expect(controls['roles'].value)
      .withContext('Roles control should be filled')
      .toEqual(upsertUserMockCopy.roles);

    expect(controls['isActive'].value)
      .withContext('IsActive control should be filled')
      .toBe(upsertUserMockCopy.isActive);
  });

  it('Expect save button to trigger saveUser', () => {
    spyOn(fixture.componentInstance, 'saveUser');
    const buttons = fixture.debugElement.queryAll(
      By.css('.modal-footer button')
    );
    const saveButton = buttons[1];
    saveButton.nativeElement.click();

    expect(fixture.componentInstance.saveUser)
      .withContext('SaveUser method should have been called')
      .toHaveBeenCalled();
  });

  it('Display username, email and roles error message when fields are blank', () => {
    updateFormUsingEvent('', '', '', true);

    // Need to click save button to show role error
    const buttons = fixture.debugElement.queryAll(
      By.css('.modal-footer button')
    );
    const saveButton = buttons[1];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const usernameErrorSpan = errorSpans[0];
    const emailErrorSpan = errorSpans[1];
    const roleErrorSpan = errorSpans[2];

    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext('Username span for error should be filled')
      .toContain('Ingresar nombre de usuario');
    expect(emailErrorSpan.nativeElement.innerHTML)
      .withContext('Email span for error should be filled')
      .toContain('Ingresar correo electronico');
    expect(roleErrorSpan.nativeElement.innerHTML)
      .withContext('Role span for error should be filled')
      .toContain('Seleccionar un rol');

    expect(fixture.componentInstance.displayMessage['username'])
      .withContext('Username displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['email'])
      .withContext('Email displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['roles'])
      .withContext('Roles displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['username'])
      .withContext('Should displayMessage error for username')
      .toContain('Ingresar nombre de usuario');
    expect(fixture.componentInstance.displayMessage['email'])
      .withContext('Should displayMessage error for email')
      .toContain('Ingresar correo electronico');
    expect(fixture.componentInstance.displayMessage['roles'])
      .withContext('Should displayMessage error for roles')
      .toContain('Seleccionar un rol');
  });

  it("Shouldn't display password and confirmPassword error message when fields are filled", () => {
    updateFormUsingEvent(
      upsertUserMockCopy.username,
      upsertUserMockCopy.email,
      upsertUserMockCopy.roles[0],
      upsertUserMockCopy.isActive
    );

    // Need to click save button to show role error
    const buttons = fixture.debugElement.queryAll(
      By.css('.modal-footer button')
    );
    const saveButton = buttons[1];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const usernameErrorSpan = errorSpans[0];
    const emailErrorSpan = errorSpans[1];
    const roleErrorSpan = errorSpans[2];

    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext("Username span for error shouldn't be filled")
      .not.toContain('Ingresar nombre de usuario');
    expect(emailErrorSpan.nativeElement.innerHTML)
      .withContext("Email span for error shouldn't be filled")
      .not.toContain('Ingresar correo electronico');
    expect(roleErrorSpan.nativeElement.innerHTML)
      .withContext("Role span for error shouldn't be filled")
      .not.toContain('Seleccionar un rol');

    expect(fixture.componentInstance.displayMessage['username'])
      .withContext('Username displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['email'])
      .withContext('Email displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['roles'])
      .withContext('Roles displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['username'])
      .withContext("Shouldn't displayMessage error for username")
      .not.toContain('Ingresar nombre de usuario');
    expect(fixture.componentInstance.displayMessage['email'])
      .withContext("Shouldn't displayMessage error for email")
      .not.toContain('Ingresar correo electronico');
    expect(fixture.componentInstance.displayMessage['roles'])
      .withContext("Shouldn't displayMessage error for roles")
      .not.toContain('Seleccionar un rol');
  });

  it('Should display role badge when role is added', () => {
    updateFormUsingEvent(
      upsertUserMockCopy.username,
      upsertUserMockCopy.email,
      upsertUserMockCopy.roles[0],
      upsertUserMockCopy.isActive
    );

    const userRoles = fixture.debugElement.queryAll(By.css('.roles .badge'));

    expect(userRoles.length).withContext('Should have only one role').toBe(1);

    expect(userRoles[0].nativeElement.innerHTML)
      .withContext('Role badge should be filled')
      .toContain(
        fixture.componentInstance.roles.find(
          (r) => r.id === upsertUserMockCopy.roles[0]
        )?.name
      );
  });

  it('Should remove role badge when role is deleted', () => {
    updateFormUsingEvent(
      upsertUserMockCopy.username,
      upsertUserMockCopy.email,
      upsertUserMockCopy.roles[0],
      upsertUserMockCopy.isActive
    );

    let userRoles = fixture.debugElement.queryAll(By.css('.roles .badge'));
    const userRoleDeleteButton = userRoles[0].query(By.css('i'));
    userRoleDeleteButton.nativeElement.click();
    fixture.detectChanges();

    userRoles = fixture.debugElement.queryAll(By.css('.roles .badge'));

    expect(userRoles.length).withContext("Shouldn't have roles").toBe(0);
  });
});
