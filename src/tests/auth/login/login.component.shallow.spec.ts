import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { loginDataMock } from 'src/tests/mocks/mocks';

const loginDataMockCopy = deepCopy(loginDataMock);

describe('Login Component (Shallow Test)', () => {
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

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['loginAccount']);
    const tokenSpy = jasmine.createSpyObj('TokenStorageService', ['saveToken']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ValidationPipe,
        ValidationErrorPipe,
        LoginComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: TokenStorageService, useValue: tokenSpy },
        provideRouter([]),
      ],
    }).compileComponents();

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
    updateFormUsingEvent(
      loginDataMockCopy.usernameOrEmail,
      loginDataMockCopy.password
    );
    expect(
      fixture.componentInstance.loginForm.controls['usernameOrEmail'].value
    )
      .withContext('Username control should be filled when input changes')
      .toBe(loginDataMockCopy.usernameOrEmail);
    expect(fixture.componentInstance.loginForm.controls['password'].value)
      .withContext('Password control should be filled when input changes')
      .toBe(loginDataMockCopy.password);
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
      .toContain('El usuario es requerido');
    expect(passwordErrorSpan.nativeElement.innerHTML)
      .withContext('Password span for error should be filled')
      .toContain('La contraseña es requerida');
  });

  it("Shouldn't display username and password error message when fields are filled", () => {
    updateFormUsingEvent(
      loginDataMockCopy.usernameOrEmail,
      loginDataMockCopy.password
    );
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    expect(errorSpans.length)
      .withContext('Should not display any error messages')
      .toBe(0);
  });
});
