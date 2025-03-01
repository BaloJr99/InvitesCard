import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/auth/forgot-password/forgot-password.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { loginDataMock } from 'src/tests/mocks/mocks';

const loginDataMockCopy = deepCopy(loginDataMock);

describe('Forgot Password (Shallow Test)', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  const updateFormUsingEvent = (username: string) => {
    const usernameInput = fixture.debugElement.query(
      By.css("input[type='text']")
    );
    usernameInput.nativeElement.value = username;
    usernameInput.nativeElement.dispatchEvent(new Event('input'));
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['sendResetPassword']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ValidationPipe,
        ValidationErrorPipe,
        ForgotPasswordComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    fixture.detectChanges();
  });

  it('created a form with usernameOrEmail, login button, reset password button', () => {
    const usernameInput = fixture.debugElement.query(
      By.css('#usernameOrEmail')
    );

    const loginUser = fixture.debugElement.query(By.css('#loginUser'));

    const resetPasswordButton = fixture.debugElement.query(
      By.css('#resetPasswordButton')
    );

    expect(usernameInput)
      .withContext("UsernameOrEmail input shouldn't be null")
      .not.toBeNull();
    expect(loginUser)
      .withContext("Login User button shouldn't be null")
      .not.toBeNull();
    expect(resetPasswordButton)
      .withContext("Reset Password button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(loginDataMockCopy.usernameOrEmail);
    expect(
      fixture.componentInstance.forgotPasswordForm.controls['usernameOrEmail']
        .value
    )
      .withContext(
        'UsernameOrEmail control should be filled when input changes'
      )
      .toBe(loginDataMockCopy.usernameOrEmail);
  });

  it('Expect form on submit to trigger sendResetPassword', () => {
    spyOn(fixture.componentInstance, 'sendResetPassword');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit');
    fixture.detectChanges();

    expect(fixture.componentInstance.sendResetPassword)
      .withContext('sendResetPassword method should have been called')
      .toHaveBeenCalled();
  });

  it('Display username error message when fields are blank', () => {
    updateFormUsingEvent('');
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );
    const usernameErrorSpan = errorSpans[0];

    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext('Username span for error should be filled')
      .toContain('El usuario es requerido');
  });

  it("Shouldn't display username error message when fields are filled", () => {
    updateFormUsingEvent(loginDataMockCopy.usernameOrEmail);
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    expect(errorSpans.length)
      .withContext('Should not display any error messages')
      .toBe(0);
  });
});
