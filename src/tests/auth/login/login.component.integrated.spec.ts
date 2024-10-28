import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { loginDataMock, tokenMock } from 'src/tests/mocks/mocks';

describe('Login Component: Integrated Test', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

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
        provideRouter([
          {
            path: 'dashboard',
            loadChildren: () =>
              import('../../../app/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
              ),
          },
        ]),
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('authService loginAccount() should called', () => {
    authServiceSpy.loginAccount.and.returnValue(of(tokenMock));

    updateFormUsingEvent(loginDataMock.usernameOrEmail, loginDataMock.password);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(authServiceSpy.loginAccount)
      .withContext("LoginAccount method from AuthService should've been called")
      .toHaveBeenCalled();
  });

  it('should route to dashboard if login successfully', () => {
    const navigateSpy = spyOn(router, 'navigate');
    authServiceSpy.loginAccount.and.returnValue(of(tokenMock));
    updateFormUsingEvent(loginDataMock.usernameOrEmail, loginDataMock.password);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(navigateSpy)
      .withContext('Should redirect to dashboard')
      .toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show credentials error if no user or username matches', async () => {
    authServiceSpy.loginAccount.and.callFake(() => {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            error: { error: 'Credenciales Incorrectas' },
          })
      );
    });

    updateFormUsingEvent(loginDataMock.usernameOrEmail, loginDataMock.password);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    fixture.detectChanges();
    const authErrorMessageSpan: HTMLSpanElement = fixture.debugElement.query(
      By.css('[data-testid="authErrorMessage"]')
    ).nativeElement;

    expect(authErrorMessageSpan.innerHTML)
      .withContext('Should display wrong credentials')
      .toContain('Credenciales Incorrectas');
  });
});
