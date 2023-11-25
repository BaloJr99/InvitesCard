import { FormBuilder } from "@angular/forms";
import { RegisterComponent } from "src/app/account/register/register.component";
import { blankUser, invalidPasswordUser, validUser } from "src/tests/mocks/mock";

const authService = jasmine.createSpyObj('AuthService', ['createNewAccount', 'loginAccount']);
const loaderService = jasmine.createSpyObj('LoaderService', ['setLoading', 'getLoading']);

describe('Register Component: Isolated Test', () => {
  let component: RegisterComponent;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  const updateForm = (username: string, password: string, email: string, confirmPassword: string) => {
    component.registrationForm.controls['username'].setValue(username);
    component.registrationForm.controls['password'].setValue(password);
    component.registrationForm.controls['email'].setValue(email);
    component.registrationForm.controls['confirmPassword'].setValue(confirmPassword);
  }

  beforeEach(() => {
    component = new RegisterComponent(
      new FormBuilder(), 
      authService, 
      routerSpy, 
      loaderService)
  })

  it('should create the component', () => {
    expect(component)
      .withContext("Register component is not being created")
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.registrationForm).toBeDefined();
    expect(component.registrationForm.invalid).toBeTruthy();
    expect(component.displayMessage).toEqual({});
    expect(component.registrationErrorMessage).toEqual("");
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm(blankUser.username, validUser.password, validUser.email, validUser.confirmPassword);
    expect(component.registrationForm.invalid)
      .withContext("Form should be invalid when username is not valid")
      .toBeTruthy();

    updateForm(validUser.username, blankUser.password, validUser.email, validUser.confirmPassword);
    expect(component.registrationForm.invalid)
      .withContext("Form should be invalid when password is not valid")
      .toBeTruthy();

    updateForm(validUser.username, validUser.password, blankUser.email, validUser.confirmPassword);
    expect(component.registrationForm.invalid)
      .withContext("Form should be invalid when email is not valid")
      .toBeTruthy();

    updateForm(validUser.username, validUser.password, validUser.email, blankUser.confirmPassword);
    expect(component.registrationForm.invalid)
      .withContext("Form should be invalid when confirmPassword is not valid")
      .toBeTruthy();
  });

  it('form should be invalid when fields are filled but password doesn\'t match', () => {
    updateForm(invalidPasswordUser.username, invalidPasswordUser.password, invalidPasswordUser.email, invalidPasswordUser.confirmPassword);
    expect(component.registrationForm.invalid)
      .withContext("Form should be invalid")
      .toBeTruthy();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(validUser.username, validUser.password, validUser.email, validUser.confirmPassword);
    expect(component.registrationForm.valid)
      .withContext("Form should be valid")
      .toBeTruthy();
  });

  it('should have username in the registrationForm', () => {
    const username = component.registrationForm.controls["username"];
    expect(username.valid)
      .withContext("Username should be invalid")
      .toBeFalsy();
    expect(username.errors?.['required'])
      .withContext("Username should be required")
      .toBeTruthy();
  });

  it('should have password in the registrationForm', () => {
    const password = component.registrationForm.controls["password"];
    expect(password.valid)
      .withContext("Password should be invalid")
      .toBeFalsy();
    expect(password.errors?.['required'])
      .withContext("Password should be required")
      .toBeTruthy();
  });

  it('should have email in the registrationForm', () => {
    const email = component.registrationForm.controls["email"];
    expect(email.valid)
      .withContext("Email should be invalid")
      .toBeFalsy();
    expect(email.errors?.['required'])
      .withContext("Email should be required")
      .toBeTruthy();
  });

  it('should have confirmPassword in the registrationForm', () => {
    const confirmPassword = component.registrationForm.controls["confirmPassword"];
    expect(confirmPassword.valid)
      .withContext("ConfirmPassword should be invalid")
      .toBeFalsy();
    expect(confirmPassword.errors?.['required'])
      .withContext("ConfirmPassword should be required")
      .toBeTruthy();
  });
});