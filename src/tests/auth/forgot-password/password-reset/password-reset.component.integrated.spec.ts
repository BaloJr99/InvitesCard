import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { of } from 'rxjs';
import { PasswordResetComponent } from 'src/app/auth/forgot-password/password-reset/password-reset.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  fullUserMock,
  loginDataMock,
  messageResponseMock,
} from 'src/tests/mocks/mocks';

const fullUserMockCopy = deepCopy(fullUserMock);
const loginDataMockCopy = deepCopy(loginDataMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);

describe('Password Reset Component (Integrated Test)', () => {
  let fixture: ComponentFixture<PasswordResetComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

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

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ValidationPipe,
        ValidationErrorPipe,
        PasswordResetComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { reset: true },
              params: { id: fullUserMockCopy.id },
            },
          },
        },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(PasswordResetComponent);
    fixture.detectChanges();
  });

  it('authService resetPassword() should have been called', () => {
    authServiceSpy.resetPassword.and.returnValue(of(messageResponseMockCopy));

    updateFormUsingEvent(
      loginDataMockCopy.password,
      loginDataMockCopy.password
    );
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(authServiceSpy.resetPassword)
      .withContext(
        'resetPassword method from AuthService should have been called'
      )
      .toHaveBeenCalled();
  });

  it('should show password reset message when submitting the form', () => {
    let passwordReset = fixture.debugElement.query(
      By.css('[data-testid="passwordReset"]')
    );
    expect(passwordReset)
      .withContext("Shouldn't show email sent div")
      .toBeNull();

    authServiceSpy.resetPassword.and.returnValue(of(messageResponseMockCopy));
    updateFormUsingEvent(
      loginDataMockCopy.password,
      loginDataMockCopy.password
    );
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    passwordReset = fixture.debugElement.query(
      By.css('[data-testid="passwordReset"]')
    );

    expect(passwordReset)
      .withContext('Should show passwordReset sent div')
      .not.toBeNull();
  });

  it('can get RouterLinks from template', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    const routerLinks = linkDes.map((de) => de.injector.get(RouterLink));

    routerLinks.forEach((link) => {
      expect(link.href).toBe('/auth/login');
    });
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
      .toBe(`/auth/login`);
  }));
});
