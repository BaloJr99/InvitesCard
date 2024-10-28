import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ForgotPasswordComponent } from 'src/app/auth/forgot-password/forgot-password.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { loginDataMock } from 'src/tests/mocks/mocks';

describe('Login Component: Shallow Test', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  const updateFormUsingEvent = (username: string) => {
    const usernameInput = fixture.debugElement.query(
      By.css("input[type='text']")
    );
    usernameInput.nativeElement.value = username;
    usernameInput.nativeElement.dispatchEvent(new Event('input'));
  };

  beforeEach(waitForAsync(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['sendResetPassword']);

    TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: authSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
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
    updateFormUsingEvent(loginDataMock.usernameOrEmail);
    expect(
      fixture.componentInstance.forgotPasswordForm.controls['usernameOrEmail']
        .value
    )
      .withContext(
        'UsernameOrEmail control should be filled when input changes'
      )
      .toBe(loginDataMock.usernameOrEmail);
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
      .toContain('Ingresar email o usuario');

    expect(fixture.componentInstance.displayMessage['usernameOrEmail'])
      .withContext('Username displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['usernameOrEmail'])
      .withContext('Should displayMessage error for username')
      .toContain('Ingresar email o usuario');
  });

  it("Shouldn't display username error message when fields are filled", () => {
    updateFormUsingEvent(loginDataMock.usernameOrEmail);
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );
    const usernameErrorSpan = errorSpans[0];

    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain('Ingresar email o usuario');

    expect(fixture.componentInstance.displayMessage['usernameOrEmail'])
      .withContext('Username displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['usernameOrEmail'])
      .withContext("DisplayMessage for username shouldn't contain error")
      .not.toContain('Ingresar email o usuario');
  });
});
