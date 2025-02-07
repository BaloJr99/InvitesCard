import { FormBuilder } from '@angular/forms';
import { UserModalComponent } from 'src/app/dashboard/users/user-modal/user-modal.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { upsertUserMock } from 'src/tests/mocks/mocks';

const upsertUserMockCopy = deepCopy(upsertUserMock);

describe('User Modal Component (Isolated Test)', () => {
  let component: UserModalComponent;

  const updateForm = (
    username: string,
    email: string,
    roles: string[],
    isActive: boolean,
    controlIsValid: boolean
  ) => {
    component.createUserForm.controls['username'].setValue(username);
    component.createUserForm.controls['email'].setValue(email);
    component.createUserForm.controls['roles'].setValue(roles);
    component.createUserForm.controls['isActive'].setValue(isActive);
    component.createUserForm.controls['controlIsValid'].setValue(
      controlIsValid
    );
  };

  beforeEach(() => {
    const usersSpy = jasmine.createSpyObj('UsersService', ['']);
    const rolesSpy = jasmine.createSpyObj('RolesService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', [
      '',
    ]);

    component = new UserModalComponent(
      usersSpy,
      rolesSpy,
      new FormBuilder(),
      toastrSpy,
      loaderSpy,
      changeDetectorRefSpy
    );
  });

  it('should create', () => {
    expect(component)
      .withContext('Component should have been created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.createUserForm)
      .withContext('createUserForm should be defined')
      .toBeDefined();
    expect(component.roles)
      .withContext('roles should be an empty array')
      .toEqual([]);
    expect(component.userRoles)
      .withContext('userRoles should be an empty array')
      .toEqual([]);
    expect(component.filteredRoles)
      .withContext('filteredRoles should be an empty array')
      .toEqual([]);
    expect(component.roleSelected)
      .withContext('roleSelected should be undefined')
      .toBeUndefined();
    expect(component.editedUser)
      .withContext('editedUser should be undefined')
      .toBeUndefined();
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', '', [], true, true);
    expect(component.createUserForm.invalid)
      .withContext('Form should be invalid when fields are empty')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(
      upsertUserMockCopy.username,
      upsertUserMockCopy.email,
      upsertUserMockCopy.roles,
      true,
      true
    );
    expect(component.createUserForm.valid)
      .withContext('Form should be valid')
      .toBeTrue();
  });

  it('should have username, email, roles, isActive in the createUserForm', () => {
    const controls = component.createUserForm.controls;

    expect(controls['username'].valid)
      .withContext('Username should be invalid')
      .toBeFalse();
    expect(controls['username'].errors?.['required'])
      .withContext('Username should be required')
      .toBeTrue();

    expect(controls['email'].valid)
      .withContext('Email should be invalid')
      .toBeFalse();
    expect(controls['email'].errors?.['required'])
      .withContext('Email should be required')
      .toBeTrue();

    expect(controls['roles'].valid)
      .withContext('Roles should be invalid')
      .toBeFalse();
    expect(controls['roles'].errors?.['required'])
      .withContext('Roles should be required')
      .toBeTrue();
  });
});
