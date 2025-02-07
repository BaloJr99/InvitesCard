import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChangePasswordComponent } from 'src/app/dashboard/profile/change-password/change-password.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { loginDataMock } from 'src/tests/mocks/mocks';

const loginDataMockCopy = deepCopy(loginDataMock);

describe('Change Password Component (Shallow test)', () => {
  let fixture: ComponentFixture<ChangePasswordComponent>;

  const updateFormUsingEvent = (password: string, confirmPassword: string) => {
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    const confirmPasswordInput = fixture.debugElement.query(
      By.css('#confirmPassword')
    );

    passwordInput.nativeElement.value = password;
    passwordInput.nativeElement.dispatchEvent(new Event('input'));

    confirmPasswordInput.nativeElement.value = confirmPassword;
    confirmPasswordInput.nativeElement.dispatchEvent(new Event('input'));
  };

  beforeEach(waitForAsync(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const authSpy = jasmine.createSpyObj('AuthService', ['']);

    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [ReactiveFormsModule, ValidationPipe, ValidationErrorPipe],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    fixture.detectChanges();
  });

  it('created a form with password, confirmPassword, reset button, cancel button', () => {
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    const confirmPasswordInput = fixture.debugElement.query(
      By.css('#confirmPassword')
    );
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const cancelButton = buttons[0];
    const resetButton = buttons[1];

    expect(confirmPasswordInput)
      .withContext("ConfirmPasswordInput input shouldn't be null")
      .not.toBeNull();
    expect(passwordInput)
      .withContext("Password input shouldn't be null")
      .not.toBeNull();
    expect(resetButton)
      .withContext("Reset button shouldn't be null")
      .not.toBeNull();
    expect(cancelButton)
      .withContext("Cancel button shouldn't be null")
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
        'ConfirmPassword control should be filled when input changes'
      )
      .toBe(loginDataMockCopy.password);
  });

  it('Expect form on submit to trigger resetPassword', () => {
    spyOn(fixture.componentInstance, 'resetPassword');
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const resetButton = buttons[1];
    resetButton.nativeElement.click();

    expect(fixture.componentInstance.resetPassword)
      .withContext('ResetPassword method should have been called')
      .toHaveBeenCalled();
  });

  it('Display password and confirmPassword error message when fields are blank', () => {
    updateFormUsingEvent('', '');
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const passwordErrorSpan = errorSpans[0];
    const confirmPasswordErrorSpan = errorSpans[1];

    expect(passwordErrorSpan.nativeElement.innerHTML)
      .withContext('Password span for error should be filled')
      .toContain('La contraseña es requerida');

    expect(confirmPasswordErrorSpan.nativeElement.innerHTML)
      .withContext('ConfirmPasswordErrorSpan span for error should be filled')
      .toContain('Repetir contraseña');
  });

  it('Display match password error message when fields are different', () => {
    updateFormUsingEvent(loginDataMockCopy.password, 'differentPassword');
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const matchPasswordErrorSpan = errorSpans[0];

    expect(matchPasswordErrorSpan.nativeElement.innerHTML)
      .withContext('Password span for error should be filled')
      .toContain('Las contraseñas no coinciden');
  });

  it("Shouldn't display password and confirmPassword error message when fields are filled", () => {
    updateFormUsingEvent(
      loginDataMockCopy.password,
      loginDataMockCopy.password
    );
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    expect(errorSpans.length)
      .withContext('There should be no error spans')
      .toBe(0);
  });
});
