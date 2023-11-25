import { ReactiveFormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from "@angular/platform-browser";

import { LoginComponent } from "src/app/account/login/login.component";
import { AuthService } from "src/core/services/auth.service";
import { TokenStorageService } from "src/core/services/token-storage.service";
import { blankUser, validUser } from "src/tests/mocks/mock";

describe('Login Component: Shallow Test', () => {
  let fixture: ComponentFixture<LoginComponent>;
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['createNewAccount', 'loginAccount']);
  const tokenStorageServiceSpy = jasmine.createSpyObj('TokenStorageService', ['signOut', 'saveToken', 'getToken', 'getTokenValues']);

  const updateFormUsingEvent = (username: string, password: string) => {
    const usernameInput = fixture.debugElement.query(By.css("input[type='text']"));
    const passwordInput = fixture.debugElement.query(By.css("input[type='password']"));

    usernameInput.nativeElement.value = username;
    usernameInput.nativeElement.dispatchEvent(new Event('input'))

    passwordInput.nativeElement.value = password;
    passwordInput.nativeElement.dispatchEvent(new Event('input'))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenStorageService, useValue: tokenStorageServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();
  });

  it('created a form with username, password, login button, forgotPassword, register', () => {
    const usernameInput = fixture.debugElement.query(By.css("#username"));
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    const authErrorSpan = fixture.debugElement.query(By.css('#authErrorMessage'));
    const forgotPassword = fixture.debugElement.query(By.css('#forgotPassword'));
    const loginButton = fixture.debugElement.query(By.css('#loginButton'));
    const registerSpan = fixture.debugElement.query(By.css('#registerSpan'));
    expect(usernameInput)
      .withContext("Username input should be defined")
      .toBeDefined();
    expect(passwordInput)
      .withContext("Password input should be defined")
      .toBeDefined();
    expect(authErrorSpan)
      .withContext("Error span should be defined")
      .toBeDefined();
    expect(forgotPassword)
      .withContext("Forgot password span should be defined")
      .toBeDefined();
    expect(loginButton)
      .withContext("Login button should be defined")
      .toBeDefined();
    expect(registerSpan)
      .withContext("Register span should be defined")
      .toBeDefined();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
      updateFormUsingEvent(validUser.username, validUser.password);
      expect(fixture.componentInstance.loginForm.controls['username'].value)
        .withContext("Username control should be filled when input changes")
        .toBe(validUser.username);
      expect(fixture.componentInstance.loginForm.controls['password'].value)
        .withContext("Password control should be filled when input changes")
        .toBe(validUser.password);
    }
  );

  it('Expect form on submit to trigger loginAccount', () => {
    spyOn(fixture.componentInstance, 'loginAccount');
    const form = fixture.debugElement.query(By.css('form'))
    form.triggerEventHandler('submit');
    fixture.detectChanges();
    expect(fixture.componentInstance.loginAccount)
      .withContext("LoginAccount method should have been called")
      .toHaveBeenCalled();
  });

  it('Display username and password error message when fields are blank', () => {
    updateFormUsingEvent(blankUser.username, blankUser.password);
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    const usernameErrorSpan = errorSpans[0];
    const passwordErrorSpan = errorSpans[1];

    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext("Username span for error should be filled")
      .toContain("Ingresar email o usuario");
    expect(passwordErrorSpan.nativeElement.innerHTML)
      .withContext("Password span for error should be filled")
      .toContain("Ingresar contraseña");

    expect(fixture.componentInstance.displayMessage["username"])
      .withContext("Username displayMessage should exist")
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage["password"])
      .withContext("Password displayMessage should exist")
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage["username"])
      .withContext("Should displayMessage error for username")
      .toContain("Ingresar email o usuario");
    expect(fixture.componentInstance.displayMessage["password"])
      .withContext("Should displayMessage error for password")
      .toContain("Ingresar contraseña");
  });

  it('Shouldn\'t display username and password error message when fields are filled', () => {
    updateFormUsingEvent(validUser.username, validUser.password);
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    const usernameErrorSpan = errorSpans[0];
    const passwordErrorSpan = errorSpans[1];

    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain("Ingresar email o usuario");
    expect(passwordErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain("Ingresar contraseña");

      expect(fixture.componentInstance.displayMessage["username"])
      .withContext("Username displayMessage should exist")
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage["password"])
      .withContext("Password displayMessage should exist")
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage["username"])
      .withContext("DisplayMessage for username shouldn't contain error")
      .not.toContain("Ingresar email o usuario");
    expect(fixture.componentInstance.displayMessage["password"])
      .withContext("DisplayMessage for password shouldn't contain error")
      .not.toContain("Ingresar contraseña");
  });
});