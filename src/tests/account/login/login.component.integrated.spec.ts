import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule }from '@angular/common/http/testing'
import { By } from "@angular/platform-browser";

import { LoginComponent } from "src/app/account/login/login.component";
import { AuthService } from "src/core/services/auth.service";
import { TokenStorageService } from "src/core/services/token-storage.service";
import { validUser } from "src/tests/mocks/mock";
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

describe('Login Component: Integrated Test', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const tokenStorageServiceSpy = jasmine.createSpyObj('TokenStorageService', ['signOut', 'saveToken', 'getToken', 'getTokenValues']);
  let router: Router;

  const updateFormUsingEvent = (username: string, password: string) => {
    const usernameInput = fixture.debugElement.query(By.css("input[type='text']"));
    const passwordInput = fixture.debugElement.query(By.css("input[type='password']"));

    usernameInput.nativeElement.value = username;
    usernameInput.nativeElement.dispatchEvent(new Event('input'))

    passwordInput.nativeElement.value = password;
    passwordInput.nativeElement.dispatchEvent(new Event('input'))
  };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['loginAccount']);
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: LoginComponent }
        ]),
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenStorageService, useValue: tokenStorageServiceSpy },
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('authService loginAccount() should called', () => {
    authServiceSpy.loginAccount.and.returnValue(of());

    updateFormUsingEvent(validUser.username, validUser.password);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'))
    button.nativeElement.click();
    fixture.detectChanges();
    
    expect(authServiceSpy.loginAccount)
      .withContext("LoginAccount method from AuthService should've been called")
      .toHaveBeenCalled();
  });

  it('should route to dashboard if login successfully', () => {
    const navigateSpy = spyOn(router, 'navigate');
    authServiceSpy.loginAccount.and.returnValue(of({ token: "simulated token"}));
    updateFormUsingEvent(validUser.username, validUser.password) ;
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button'))
    button.nativeElement.click();
    fixture.detectChanges();

    expect(navigateSpy)
      .withContext("Should redirect to dashboard")
      .toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show credentials error if no user or username matches', async () => {
    authServiceSpy.loginAccount.and.callFake(() => {
      return throwError(() => new HttpErrorResponse({ status: 401 }));
    });

    updateFormUsingEvent(validUser.username, validUser.password) ;
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button'))
    button.nativeElement.click();
    
    fixture.detectChanges();
    const authErrorMessageSpan: HTMLSpanElement = fixture.debugElement.query(By.css('[data-testid="authErrorMessage"]')).nativeElement;
    expect(authErrorMessageSpan.innerHTML)
      .withContext("Should display wrong credentials")
      .toContain('Credenciales Incorrectas');
  });
});