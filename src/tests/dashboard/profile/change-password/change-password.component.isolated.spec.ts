import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangePasswordComponent } from 'src/app/dashboard/profile/change-password/change-password.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { loginDataMock } from 'src/tests/mocks/mocks';

const loginDataMockCopy = deepCopy(loginDataMock);

describe('Change Password Component (Isolated Test)', () => {
  let component: ChangePasswordComponent;

  const updateForm = (password: string, confirmPassword: string) => {
    component.passwordResetForm.controls['password'].setValue(password);
    component.passwordResetForm.controls['confirmPassword'].setValue(
      confirmPassword
    );
  };

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const authSpy = jasmine.createSpyObj('AuthService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);

    component = new ChangePasswordComponent(
      new FormBuilder(),
      toastrSpy,
      authSpy,
      loaderSpy
    );
  });

  it('should create', () => {
    expect(component)
      .withContext('ChangePasswordComponent should be created successfully')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.userId)
      .withContext('userId should be an empty string')
      .toBe('');

    expect(component.showChangePasswordValue)
      .withContext(
        'showChangePasswordValue should be an instance of EventEmitter'
      )
      .toBeInstanceOf(EventEmitter);

    expect(component.passwordResetForm)
      .withContext('passwordResetForm should be an instance of FormGroup')
      .toBeInstanceOf(FormGroup);
    expect(component.passwordResetForm)
      .withContext('passwordResetForm should be defined')
      .toBeDefined();
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', '');
    expect(component.passwordResetForm.invalid)
      .withContext('Form should be invalid when fields are empty')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(loginDataMockCopy.password, loginDataMockCopy.password);
    expect(component.passwordResetForm.valid)
      .withContext('Form should be valid')
      .toBeTrue();
  });

  it('form should be invalid when fields are not the same', () => {
    updateForm(loginDataMockCopy.password, 'differentPassword');
    expect(component.passwordResetForm.valid)
      .withContext('Form should be valid')
      .toBeFalse();
  });

  it('should have password and confirmPassword in the passwordResetForm', () => {
    const password = component.passwordResetForm.controls['password'];
    const confirmPassword =
      component.passwordResetForm.controls['confirmPassword'];

    expect(password.valid)
      .withContext('Password should be invalid')
      .toBeFalsy();
    expect(password.errors?.['required'])
      .withContext('Password should be required')
      .toBeTruthy();

    expect(confirmPassword.valid)
      .withContext('ConfirmPassword should be invalid')
      .toBeFalsy();
    expect(confirmPassword.errors?.['required'])
      .withContext('ConfirmPassword should be required')
      .toBeTruthy();
  });
});
