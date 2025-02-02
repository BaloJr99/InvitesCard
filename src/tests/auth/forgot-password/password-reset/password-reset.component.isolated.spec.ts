import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PasswordResetComponent } from 'src/app/auth/forgot-password/password-reset/password-reset.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { loginDataMock } from 'src/tests/mocks/mocks';

const loginDataMockCopy = deepCopy(loginDataMock);

describe('PasswordResetComponent Isolated', () => {
  let component: PasswordResetComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['']);
  const loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['']);

  const updateForm = (password: string, confirmPassword: string) => {
    component.passwordResetForm.controls['password'].setValue(password);
    component.passwordResetForm.controls['confirmPassword'].setValue(
      confirmPassword
    );
  };

  beforeEach(() => {
    component = new PasswordResetComponent(
      new ActivatedRoute(),
      new FormBuilder(),
      authServiceSpy,
      loaderServiceSpy
    );
  });

  it('should create', () => {
    expect(component)
      .withContext('PasswordResetComponent is not being created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.passwordResetForm)
      .withContext('PasswordResetForm should exist')
      .not.toBeNull();
    expect(component.passwordResetForm.invalid)
      .withContext('PasswordResetForm initial value should be invalid')
      .toBeTrue();
    expect(component.displayMessage)
      .withContext('Display Messages Array should be empty')
      .toEqual({});
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', loginDataMockCopy.password);
    expect(component.passwordResetForm.invalid)
      .withContext('Form should be invalid when password is not valid')
      .toBeTrue();

    updateForm(loginDataMockCopy.password, '');
    expect(component.passwordResetForm.invalid)
      .withContext('Form should be invalid when confirmPassword is not valid')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(loginDataMockCopy.password, loginDataMockCopy.password);
    expect(component.passwordResetForm.valid)
      .withContext('Form should be valid')
      .toBeTruthy();
  });

  it('should have the password in the passwordResetForm', () => {
    const password = component.passwordResetForm.controls['password'];
    expect(password.valid)
      .withContext('password should be invalid')
      .toBeFalsy();
    expect(password.errors?.['required'])
      .withContext('password should be required')
      .toBeTruthy();
  });

  it('should have the confirmPassword in the passwordResetForm', () => {
    const confirmPassword =
      component.passwordResetForm.controls['confirmPassword'];
    expect(confirmPassword.valid)
      .withContext('confirmPassword should be invalid')
      .toBeFalsy();
    expect(confirmPassword.errors?.['required'])
      .withContext('confirmPassword should be required')
      .toBeTruthy();
  });

  it("should have the passwordMatchError error if the password and confirmPassword doesn't match", () => {
    updateForm(loginDataMockCopy.password, loginDataMockCopy.password + '1');
    expect(component.passwordResetForm.errors?.['passwordMatchError'])
      .withContext('passwordMatchError error should exist')
      .toBeTruthy();
  });

  it("shouldn't have the passwordMatchError error if the password and confirmPassword doesn't match", () => {
    updateForm(loginDataMockCopy.password, loginDataMockCopy.password);
    expect(component.passwordResetForm.errors?.['passwordMatchError'])
      .withContext("passwordMatchError error shouldn't exist")
      .toBeFalsy();
  });
});
