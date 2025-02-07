import { FormBuilder } from '@angular/forms';
import { RoleActionEvent } from 'src/app/core/models/enum';
import { UserRoleComponent } from 'src/app/dashboard/users/user-role-modal/user-role.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { roleMock } from 'src/tests/mocks/mocks';

const roleMockCopy = deepCopy(roleMock);

describe('User Role Modal Component (Isolated Test)', () => {
  let component: UserRoleComponent;

  const updateForm = (
    name: string,
    isActive: boolean,
    controlIsValid: boolean
  ) => {
    component.createRoleForm.controls['name'].setValue(name);
    component.createRoleForm.controls['isActive'].setValue(isActive);
    component.createRoleForm.controls['controlIsValid'].setValue(
      controlIsValid
    );
  };

  beforeEach(() => {
    const rolesSpy = jasmine.createSpyObj('RolesService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);

    component = new UserRoleComponent(
      rolesSpy,
      new FormBuilder(),
      toastrSpy,
      loaderSpy
    );
  });

  it('should create', () => {
    expect(component)
      .withContext('Component should have been created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.createRoleForm)
      .withContext('createRoleForm should be defined')
      .toBeDefined();
    expect(component.currentRoleAction)
      .withContext('roles should be an empty array')
      .toEqual(RoleActionEvent.None);
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', true, true);
    expect(component.createRoleForm.invalid)
      .withContext('Form should be invalid when fields are empty')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(roleMockCopy.name, roleMockCopy.isActive, true);
    expect(component.createRoleForm.valid)
      .withContext('Form should be valid')
      .toBeTrue();
  });

  it('should have name in the createRoleForm', () => {
    const controls = component.createRoleForm.controls;

    expect(controls['name'].valid)
      .withContext('Name should be invalid')
      .toBeFalse();
    expect(controls['name'].errors?.['required'])
      .withContext('Name should be required')
      .toBeTrue();
  });
});
