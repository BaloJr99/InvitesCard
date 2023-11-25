import { FormBuilder } from "@angular/forms";

import { LoginComponent } from "src/app/account/login/login.component";
import { blankUser, validUser } from "src/tests/mocks/mock";

const authService = jasmine.createSpyObj('AuthService', ['createNewAccount', 'loginAccount']);
const tokenService = jasmine.createSpyObj('TokenStorageService', ['saveToken', 'getToken', 'getTokenValues', 'signOut']);
const loaderService = jasmine.createSpyObj('LoaderService', ['setLoading', 'getLoading']);

describe('Login Component: Isolated Test', () => {
  let component: LoginComponent;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  const updateForm = (username: string, password: string) => {
    component.loginForm.controls['username'].setValue(username);
    component.loginForm.controls['password'].setValue(password);
  }

  beforeEach(() => {
    component = new LoginComponent(
      new FormBuilder(), 
      authService,
      routerSpy,
      tokenService,
      loaderService);
  });

  it('should create the component', () => {
    expect(component)
      .withContext("Login component is not being created")
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.loginForm)
      .withContext("LoginForm should exist")
      .toBeDefined();
    expect(component.loginForm.invalid)
      .withContext("LoginForm initial value should be invalid")
      .toBeTruthy();
    expect(component.displayMessage)
      .withContext("Display Messages Array should be empty")
      .toEqual({});
    expect(component.authErrorMessage)
      .withContext("Auth Error should be empty")
      .toEqual("");
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm(blankUser.username, validUser.password);
    expect(component.loginForm.invalid)
      .withContext("Form should be invalid when username is not valid")
      .toBeTruthy();

    updateForm(validUser.username, blankUser.password);
    expect(component.loginForm.invalid)
      .withContext("Form should be invalid when password is not valid")
      .toBeTruthy();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(validUser.username, validUser.password);
    expect(component.loginForm.valid)
      .withContext("Form should be valid")
      .toBeTruthy();
  });

  it('should have username in the loginForm', () => {
    const username = component.loginForm.controls["username"];
    expect(username.valid)
      .withContext("Username should be invalid")
      .toBeFalsy();
    expect(username.errors?.['required'])
      .withContext("Username should be required")
      .toBeTruthy();
  });

  it('should have password in the loginForm', () => {
    const password = component.loginForm.controls["password"];
    expect(password.valid)
      .withContext("Password should be invalid")
      .toBeFalsy();
    expect(password.errors?.['required'])
      .withContext("Password should be required")
      .toBeTruthy();
  });
});