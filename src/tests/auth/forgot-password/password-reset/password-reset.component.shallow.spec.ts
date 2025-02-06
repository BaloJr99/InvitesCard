import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { PasswordResetComponent } from 'src/app/auth/forgot-password/password-reset/password-reset.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { fullUserMock, loginDataMock } from 'src/tests/mocks/mocks';

const fullUserMockCopy = deepCopy(fullUserMock);
const loginDataMockCopy = deepCopy(loginDataMock);

describe('Password Reset Component (Shallow Test)', () => {
  let fixture: ComponentFixture<PasswordResetComponent>;

  const updateFormUsingEvent = (password: string, confirmPassword: string) => {
    const passwordInput = fixture.debugElement.query(By.css('#password'));

    passwordInput.nativeElement.value = password;
    passwordInput.nativeElement.dispatchEvent(new Event('input'));

    const confirmPasswordInput = fixture.debugElement.query(
      By.css('#confirmPassword')
    );

    confirmPasswordInput.nativeElement.value = confirmPassword;
    confirmPasswordInput.nativeElement.dispatchEvent(new Event('input'));
  };

  beforeEach(waitForAsync(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);

    TestBed.configureTestingModule({
      declarations: [PasswordResetComponent],
      imports: [ReactiveFormsModule, ValidationPipe, ValidationErrorPipe],
      providers: [
        { provide: AuthService, useValue: authSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { reset: true },
              paramMap: convertToParamMap({ id: fullUserMockCopy.id }),
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    fixture.detectChanges();
  });

  it('created a form with password, confirmPassword, login button, reset password button', () => {
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    const confirmPasswordInput = fixture.debugElement.query(
      By.css('#confirmPassword')
    );
    const loginUser = fixture.debugElement.query(By.css('#loginUser'));

    const resetPasswordButton = fixture.debugElement.query(
      By.css('#resetPasswordButton')
    );

    expect(passwordInput)
      .withContext("Password input shouldn't be null")
      .not.toBeNull();
    expect(confirmPasswordInput)
      .withContext("Confirm Password input shouldn't be null")
      .not.toBeNull();
    expect(loginUser)
      .withContext("Login User button shouldn't be null")
      .not.toBeNull();
    expect(resetPasswordButton)
      .withContext("Reset Password button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(
      loginDataMockCopy.password,
      loginDataMockCopy.password
    );
    expect(
      fixture.componentInstance.passwordResetForm.controls['password'].value
    )
      .withContext('Password control should be filled when input changes')
      .toBe(loginDataMockCopy.password);

    expect(
      fixture.componentInstance.passwordResetForm.controls['confirmPassword']
        .value
    )
      .withContext(
        'Confirm Password control should be filled when input changes'
      )
      .toBe(loginDataMockCopy.password);
  });

  it('Expect form on submit to trigger resetPassword', () => {
    spyOn(fixture.componentInstance, 'resetPassword');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit');
    fixture.detectChanges();

    expect(fixture.componentInstance.resetPassword)
      .withContext('resetPassword method should have been called')
      .toHaveBeenCalled();
  });

  it('Display password and confirm password error message when fields are blank', () => {
    updateFormUsingEvent('', '');
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );
    const passwordErrorSpan = errorSpans[0];
    const confirmPasswordErrorSpan = errorSpans[1];

    expect(passwordErrorSpan.nativeElement.innerHTML)
      .withContext('Password span for error should be filled')
      .toContain('Ingresar contraseña');

    expect(confirmPasswordErrorSpan.nativeElement.innerHTML)
      .withContext('Confirm Password span for error should be filled')
      .toContain('Confirmar contraseña');
  });

  it("Display match error when passwords doesn't match", () => {
    updateFormUsingEvent(
      loginDataMockCopy.password,
      loginDataMockCopy.password + '1'
    );
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const passwordMatchErrorSpan = errorSpans[0];

    expect(passwordMatchErrorSpan.nativeElement.innerHTML)
      .withContext('Match Error span for error should be filled')
      .toContain('Las contraseñas no coinciden');
  });

  it("Shouldn't display username error message when fields are filled", () => {
    updateFormUsingEvent(
      loginDataMockCopy.password,
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
