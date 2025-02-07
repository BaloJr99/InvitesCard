import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChangePasswordComponent } from 'src/app/dashboard/profile/change-password/change-password.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { loginDataMock, messageResponseMock } from 'src/tests/mocks/mocks';

const loginDataMockCopy = deepCopy(loginDataMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);

describe('Change Password Component (Integrated Test)', () => {
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

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
    const authSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);

    TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [ReactiveFormsModule, ValidationPipe, ValidationErrorPipe],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    fixture.detectChanges();
  });

  it('authService resetPassword() should called', () => {
    authServiceSpy.resetPassword.and.returnValue(of(messageResponseMockCopy));

    updateFormUsingEvent(
      loginDataMockCopy.password,
      loginDataMockCopy.password
    );
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const resetButton = buttons[1];
    resetButton.nativeElement.click();
    fixture.detectChanges();

    expect(authServiceSpy.resetPassword)
      .withContext(
        "resetPassword method from AuthService should've been called"
      )
      .toHaveBeenCalled();
  });
});
