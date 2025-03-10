import { HttpErrorResponse } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { loginDataMock, tokenMock } from 'src/tests/mocks/mocks';

const loginDataMockCopy = deepCopy(loginDataMock);
const tokenMockCopy = deepCopy(tokenMock);

describe('Login Component (Integrated Test)', () => {
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

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['loginAccount']);
    const tokenSpy = jasmine.createSpyObj('TokenStorageService', ['saveToken']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterLink,
        ValidationPipe,
        ValidationErrorPipe,
        LoginComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: TokenStorageService, useValue: tokenSpy },
        provideRouter([
          {
            path: 'dashboard',
            loadComponent: () =>
              import('../../../app/dashboard/dashboard.component').then(
                (m) => m.DashboardComponent
              ),
          },
        ]),
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('authService loginAccount() should called', () => {
    authServiceSpy.loginAccount.and.returnValue(of(tokenMockCopy));

    updateFormUsingEvent(
      loginDataMockCopy.usernameOrEmail,
      loginDataMockCopy.password
    );
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(authServiceSpy.loginAccount)
      .withContext("LoginAccount method from AuthService should've been called")
      .toHaveBeenCalled();
  });

  it('should route to dashboard if login successfully', () => {
    spyOn(router, 'navigate');
    authServiceSpy.loginAccount.and.returnValue(of(tokenMockCopy));
    updateFormUsingEvent(
      loginDataMockCopy.usernameOrEmail,
      loginDataMockCopy.password
    );
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(router.navigate)
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

    updateFormUsingEvent(
      loginDataMockCopy.usernameOrEmail,
      loginDataMockCopy.password
    );
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

  it('can get RouterLinks from template', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    const routerLinks = linkDes.map((de) => de.injector.get(RouterLink));

    expect(routerLinks[0].href).toBe('/auth/forgotPassword');
  });

  it('should route to forgotPassword page', fakeAsync(() => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    const firstEventLink = linkDes[0];
    router.resetConfig([{ path: '**', children: [] }]);

    firstEventLink.triggerEventHandler('click', { button: 0 });

    tick();

    fixture.detectChanges();

    expect(router.url)
      .withContext('Should redirect to event details page')
      .toBe(`/auth/forgotPassword`);
  }));
});
