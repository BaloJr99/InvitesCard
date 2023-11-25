import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from "rxjs";
import { LoginComponent } from "src/app/account/login/login.component";
import { RegisterComponent } from "src/app/account/register/register.component";
import { AuthService } from "src/core/services/auth.service";
import { TokenStorageService } from "src/core/services/token-storage.service";
import { validUser } from "src/tests/mocks/mock";

describe('Register Component: Integrated Test', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const tokenStorageServiceSpy = jasmine.createSpyObj('TokenStorageService', ['signOut', 'saveToken', 'getToken', 'getTokenValues']);
  let router: Router;

  const updateFormUsingEvent = (username: string, password: string, email: string, confirmPassword: string) => {
    const usernameInput = fixture.debugElement.query(By.css("#username"));
    const passwordInput = fixture.debugElement.query(By.css("#password"));
    const emailInput = fixture.debugElement.query(By.css("#email"));
    const confirmPasswordInput = fixture.debugElement.query(By.css("#confirmPassword"));

    usernameInput.nativeElement.value = username;
    usernameInput.nativeElement.dispatchEvent(new Event('input'));

    passwordInput.nativeElement.value = password;
    passwordInput.nativeElement.dispatchEvent(new Event('input'));

    emailInput.nativeElement.value = email;
    emailInput.nativeElement.dispatchEvent(new Event('input'));

    confirmPasswordInput.nativeElement.value = confirmPassword;
    confirmPasswordInput.nativeElement.dispatchEvent(new Event('input'));
  };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['createNewAccount']);
    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'account', children: [
            { path: 'login', component: LoginComponent }
          ] }
        ]),
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenStorageService, useValue: tokenStorageServiceSpy },
      ]
    });

    fixture = TestBed.createComponent(RegisterComponent);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('authService createNewAccount() should called', () => {
    authServiceSpy.createNewAccount.and.returnValue(of());

    updateFormUsingEvent(validUser.username, validUser.password, validUser.email, validUser.confirmPassword);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'))
    button.nativeElement.click();
    fixture.detectChanges();
    
    expect(authServiceSpy.createNewAccount)
      .withContext("CreateNewAccount method from AuthService should've been called")
      .toHaveBeenCalled();
  });

  it('should route to login if account created successfully', () => {
    const navigateSpy = spyOn(router, 'navigate');
    authServiceSpy.createNewAccount.and.returnValue(of({ token: "simulated token"}));
    updateFormUsingEvent(validUser.username, validUser.password, validUser.email, validUser.confirmPassword);
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button'))
    button.nativeElement.click();
    fixture.detectChanges();

    expect(navigateSpy)
      .withContext("Should redirect to dashboard")
      .toHaveBeenCalledWith(['/account/login']);
  });

  it('should show credentials error if no user or username matches', () => {
    authServiceSpy.createNewAccount.and.callFake(() => {
      return throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'El usuario ya existe' } }));
    });

    updateFormUsingEvent(validUser.username, validUser.password, validUser.email, validUser.confirmPassword);
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button'))
    button.nativeElement.click();
    
    fixture.detectChanges();

    const authErrorMessageSpan: HTMLSpanElement = fixture.debugElement.query(By.css('#registrationErrorMessage')).nativeElement;
    expect(authErrorMessageSpan.innerHTML)
      .withContext("Should display user already exists")
      .toContain('El usuario ya existe');
  });
});