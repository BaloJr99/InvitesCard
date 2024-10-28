import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ForgotPasswordComponent } from 'src/app/auth/forgot-password/forgot-password.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { loginDataMock, messageResponseMock } from 'src/tests/mocks/mocks';

describe('Forgot Password Component: Integrated Test', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

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

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    fixture.detectChanges();
  });

  it('authService sendResetPassword() should called', () => {
    authServiceSpy.sendResetPassword.and.returnValue(of(messageResponseMock));

    updateFormUsingEvent(loginDataMock.usernameOrEmail);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(authServiceSpy.sendResetPassword)
      .withContext(
        "SendResetPassword method from AuthService should've been called"
      )
      .toHaveBeenCalled();
  });

  it('should change display message sent successfully', () => {
    let emailSentDiv = fixture.debugElement.query(
      By.css('[data-testid="emailSent"]')
    );
    expect(emailSentDiv)
      .withContext("Shouldn't show email sent div")
      .toBeNull();

    authServiceSpy.sendResetPassword.and.returnValue(of(messageResponseMock));
    updateFormUsingEvent(loginDataMock.usernameOrEmail);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    emailSentDiv = fixture.debugElement.query(
      By.css('[data-testid="emailSent"]')
    );

    expect(emailSentDiv)
      .withContext("Shouldn't show email sent div")
      .not.toBeNull();
  });
});
