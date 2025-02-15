import { FormBuilder } from '@angular/forms';
import { ForgotPasswordComponent } from 'src/app/auth/forgot-password/forgot-password.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { loginDataMock } from 'src/tests/mocks/mocks';

const loginDataMockCopy = deepCopy(loginDataMock);

describe('ForgotPasswordComponent Isolated', () => {
  let component: ForgotPasswordComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['']);

  const updateForm = (username: string) => {
    component.forgotPasswordForm.controls['usernameOrEmail'].setValue(username);
  };

  beforeEach(() => {
    component = new ForgotPasswordComponent(new FormBuilder(), authServiceSpy);
  });

  it('should create', () => {
    expect(component)
      .withContext('ForgotPasswordComponent is not being created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.forgotPasswordForm)
      .withContext('ForgotPasswordForm should exist')
      .not.toBeNull();
    expect(component.forgotPasswordForm.invalid)
      .withContext('ForgotPasswordForm initial value should be invalid')
      .toBeTrue();
    expect(component.emailSent)
      .withContext('Email sent should be false')
      .toBeFalse();
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('');
    expect(component.forgotPasswordForm.invalid)
      .withContext('Form should be invalid when usernameOrEmail is not valid')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(loginDataMockCopy.usernameOrEmail);
    expect(component.forgotPasswordForm.valid)
      .withContext('Form should be valid')
      .toBeTruthy();
  });

  it('should have usernameOrEmail in the forgotPasswordForm', () => {
    const usernameOrEmail =
      component.forgotPasswordForm.controls['usernameOrEmail'];
    expect(usernameOrEmail.valid)
      .withContext('usernameOrEmail should be invalid')
      .toBeFalsy();
    expect(usernameOrEmail.errors?.['required'])
      .withContext('usernameOrEmail should be required')
      .toBeTruthy();
  });
});
