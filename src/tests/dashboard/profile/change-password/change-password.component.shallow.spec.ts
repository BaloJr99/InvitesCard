import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChangePasswordComponent } from 'src/app/dashboard/profile/change-password/change-password.component';
import { loginDataMock } from 'src/tests/mocks/mocks';

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
      imports: [ReactiveFormsModule],
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
    updateFormUsingEvent(loginDataMock.password, loginDataMock.password);
    expect(
      fixture.componentInstance.passwordResetForm.controls['password'].value
    )
      .withContext('Password control should be filled when input changes')
      .toBe(loginDataMock.password);
    expect(
      fixture.componentInstance.passwordResetForm.controls['confirmPassword']
        .value
    )
      .withContext(
        'ConfirmPassword control should be filled when input changes'
      )
      .toBe(loginDataMock.password);
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
      .toContain('Ingresar contraseña');

    expect(confirmPasswordErrorSpan.nativeElement.innerHTML)
      .withContext('ConfirmPasswordErrorSpan span for error should be filled')
      .toContain('Confirmar contraseña');

    expect(fixture.componentInstance.displayMessage['password'])
      .withContext('Password displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['confirmPassword'])
      .withContext('ConfirmPassword displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['password'])
      .withContext('Should displayMessage error for password')
      .toContain('Ingresar contraseña');
    expect(fixture.componentInstance.displayMessage['confirmPassword'])
      .withContext('Should displayMessage error for confirmPassword')
      .toContain('Confirmar contraseña');
  });

  it('Display match password error message when fields are different', () => {
    updateFormUsingEvent(loginDataMock.password, 'differentPassword');
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const matchPasswordErrorSpan = errorSpans[2];

    expect(matchPasswordErrorSpan.nativeElement.innerHTML)
      .withContext('Password span for error should be filled')
      .toContain('Las contraseñas no coinciden');
    expect(fixture.componentInstance.displayMessage['passwordMatch'])
      .withContext('passwordMatch displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['passwordMatch'])
      .withContext('Should displayMessage error for passwordMatch')
      .toContain('Las contraseñas no coinciden');
  });

  it("Shouldn't display password and confirmPassword error message when fields are filled", () => {
    updateFormUsingEvent(loginDataMock.password, loginDataMock.password);
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );
    const passwordErrorSpan = errorSpans[0];
    const confirmPasswordErrorSpan = errorSpans[1];

    expect(passwordErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain('Ingresar contraseña');
    expect(confirmPasswordErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain('Confirmar contraseña');

    expect(fixture.componentInstance.displayMessage['password'])
      .withContext('Password displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['confirmPassword'])
      .withContext('ConfirmPassword displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['password'])
      .withContext("DisplayMessage for password shouldn't contain error")
      .not.toContain('Ingresar contraseña');
    expect(fixture.componentInstance.displayMessage['confirmPassword'])
      .withContext("DisplayMessage for confirmPassword shouldn't contain error")
      .not.toContain('Confirmar contraseña');
  });
});
