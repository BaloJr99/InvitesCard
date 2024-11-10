import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { loginDataMock } from 'src/tests/mocks/mocks';

describe('Login Component: Shallow Test', () => {
  let fixture: ComponentFixture<LoginComponent>;

  const updateFormUsingEvent = (username: string, password: string) => {
    const usernameInput = fixture.debugElement.query(
      By.css("input[type='text']")
    );
    const passwordInput = fixture.debugElement.query(
      By.css("input[type='password']")
    );

    usernameInput.nativeElement.value = username;
    usernameInput.nativeElement.dispatchEvent(new Event('input'));

    passwordInput.nativeElement.value = password;
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
  };

  beforeEach(waitForAsync(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['loginAccount']);
    const tokenSpy = jasmine.createSpyObj('TokenStorageService', ['saveToken']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: TokenStorageService, useValue: tokenSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('created a form with username, password, login button, forgotPassword, register', () => {
    const usernameInput = fixture.debugElement.query(
      By.css('#usernameOrEmail')
    );
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    const authErrorSpan = fixture.debugElement.query(
      By.css('[data-testid="authErrorMessage"]')
    );
    const forgotPassword = fixture.debugElement.query(
      By.css('#forgotPassword')
    );
    const loginButton = fixture.debugElement.query(By.css('#loginButton'));

    expect(usernameInput)
      .withContext("Username input shouldn't be null")
      .not.toBeNull();
    expect(passwordInput)
      .withContext("Password input shouldn't be null")
      .not.toBeNull();
    expect(authErrorSpan)
      .withContext("Error span shouldn't be null")
      .not.toBeNull();
    expect(forgotPassword)
      .withContext("Forgot password span shouldn't be null")
      .not.toBeNull();
    expect(loginButton)
      .withContext("Login button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(loginDataMock.usernameOrEmail, loginDataMock.password);
    expect(
      fixture.componentInstance.loginForm.controls['usernameOrEmail'].value
    )
      .withContext('Username control should be filled when input changes')
      .toBe(loginDataMock.usernameOrEmail);
    expect(fixture.componentInstance.loginForm.controls['password'].value)
      .withContext('Password control should be filled when input changes')
      .toBe(loginDataMock.password);
  });

  it('Expect form on submit to trigger loginAccount', () => {
    spyOn(fixture.componentInstance, 'loginAccount');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit');
    
    expect(fixture.componentInstance.loginAccount)
      .withContext('LoginAccount method should have been called')
      .toHaveBeenCalled();
  });

  it('Display username and password error message when fields are blank', () => {
    updateFormUsingEvent('', '');
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );
    const usernameErrorSpan = errorSpans[0];
    const passwordErrorSpan = errorSpans[1];

    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext('Username span for error should be filled')
      .toContain('Ingresar email o usuario');
    expect(passwordErrorSpan.nativeElement.innerHTML)
      .withContext('Password span for error should be filled')
      .toContain('Ingresar contraseña');

    expect(fixture.componentInstance.displayMessage['usernameOrEmail'])
      .withContext('Username displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['password'])
      .withContext('Password displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['usernameOrEmail'])
      .withContext('Should displayMessage error for username')
      .toContain('Ingresar email o usuario');
    expect(fixture.componentInstance.displayMessage['password'])
      .withContext('Should displayMessage error for password')
      .toContain('Ingresar contraseña');
  });

  it("Shouldn't display username and password error message when fields are filled", () => {
    updateFormUsingEvent(loginDataMock.usernameOrEmail, loginDataMock.password);
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );
    const usernameErrorSpan = errorSpans[0];
    const passwordErrorSpan = errorSpans[1];

    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain('Ingresar email o usuario');
    expect(passwordErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain('Ingresar contraseña');

    expect(fixture.componentInstance.displayMessage['usernameOrEmail'])
      .withContext('Username displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['password'])
      .withContext('Password displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['usernameOrEmail'])
      .withContext("DisplayMessage for username shouldn't contain error")
      .not.toContain('Ingresar email o usuario');
    expect(fixture.componentInstance.displayMessage['password'])
      .withContext("DisplayMessage for password shouldn't contain error")
      .not.toContain('Ingresar contraseña');
  });
});
