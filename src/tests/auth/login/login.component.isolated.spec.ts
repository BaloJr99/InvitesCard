import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import { loginDataMock } from 'src/tests/mocks/mocks';

const loginDataMockCopy = deepCopy(loginDataMock);

describe('Login Component (Isolated Test)', () => {
  let component: LoginComponent;
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['']);
  const tokenServiceSpy = jasmine.createSpyObj('TokenStorageService', ['']);
  const routerSpy = jasmine.createSpyObj('Router', ['']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

  const updateForm = (username: string, password: string) => {
    component.loginForm.controls['usernameOrEmail'].setValue(username);
    component.loginForm.controls['password'].setValue(password);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenStorageService, useValue: tokenServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    });
    
    component = TestBed.createComponent(LoginComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component)
      .withContext('LoginComponent is not being created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.loginForm)
      .withContext('LoginForm should exist')
      .not.toBeNull();
    expect(component.loginForm.invalid)
      .withContext('LoginForm initial value should be invalid')
      .toBeTrue();
    expect(component.authErrorMessage)
      .withContext('Auth Error should be empty')
      .toEqual('');
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', '');
    expect(component.loginForm.invalid)
      .withContext('Form should be invalid when username is not valid')
      .toBeTrue();

    updateForm('', '');
    expect(component.loginForm.invalid)
      .withContext('Form should be invalid when password is not valid')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(loginDataMockCopy.usernameOrEmail, loginDataMockCopy.password);
    expect(component.loginForm.valid)
      .withContext('Form should be valid')
      .toBeTruthy();
  });

  it('should have usernameOrEmail in the loginForm', () => {
    const usernameOrEmail = component.loginForm.controls['usernameOrEmail'];
    expect(usernameOrEmail.valid)
      .withContext('usernameOrEmail should be invalid')
      .toBeFalsy();
    expect(usernameOrEmail.errors?.['required'])
      .withContext('usernameOrEmail should be required')
      .toBeTruthy();
  });

  it('should have password in the loginForm', () => {
    const password = component.loginForm.controls['password'];
    expect(password.valid)
      .withContext('Password should be invalid')
      .toBeFalsy();
    expect(password.errors?.['required'])
      .withContext('Password should be required')
      .toBeTruthy();
  });
});
