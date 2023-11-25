import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { RegisterComponent } from "src/app/account/register/register.component";
import { AuthService } from "src/core/services/auth.service";
import { TokenStorageService } from "src/core/services/token-storage.service";
import { blankUser, invalidPasswordUser, validUser } from "src/tests/mocks/mock";

describe('Register Component: Shallow Test', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['createNewAccount']);
  const tokenStorageServiceSpy = jasmine.createSpyObj('TokenStorageService', ['signOut', 'saveToken', 'getToken', 'getTokenValues']);

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
    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenStorageService, useValue: tokenStorageServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(RegisterComponent);

    fixture.detectChanges();
  });

  it('created a form with username, password, email, confirmation password, create account button, alreadyHaveAccount', () => {
    const usernameInput = fixture.debugElement.query(By.css("#username"));
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    const emailInput = fixture.debugElement.query(By.css("#email"));
    const confirmPasswordInput = fixture.debugElement.query(By.css('#confirmPassword'));
    const registrationErrorMessageSpan = fixture.debugElement.query(By.css('#registrationErrorMessage'));
    const registerButton = fixture.debugElement.query(By.css('#registerButton'));
    const alreadyHaveAccountSpan = fixture.debugElement.query(By.css('#alreadyHaveAccount'));

    expect(usernameInput)
      .withContext("Username input should be defined")
      .toBeDefined();
    expect(passwordInput)
      .withContext("Password input should be defined")
      .toBeDefined();
    expect(emailInput)
      .withContext("Email input should be defined")
      .toBeDefined();
    expect(confirmPasswordInput)
      .withContext("Confirm Password input should be defined")
      .toBeDefined();
    expect(registrationErrorMessageSpan)
      .withContext("Error span should be defined")
      .toBeDefined();
    expect(registerButton)
      .withContext("Register button should be defined")
      .toBeDefined();
    expect(alreadyHaveAccountSpan)
      .withContext("Already have an account span should be defined")
      .toBeDefined();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
      updateFormUsingEvent(validUser.username, validUser.password, validUser.email, validUser.confirmPassword);
      expect(fixture.componentInstance.registrationForm.controls['username'].value)
        .withContext("Username control should be filled when input changes")
        .toBe(validUser.username);
      expect(fixture.componentInstance.registrationForm.controls['password'].value)
        .withContext("Password control should be filled when input changes")
        .toBe(validUser.password);
      expect(fixture.componentInstance.registrationForm.controls['email'].value)
        .withContext("Email control should be filled when input changes")
        .toBe(validUser.email);
      expect(fixture.componentInstance.registrationForm.controls['confirmPassword'].value)
        .withContext("confirmPassword control should be filled when input changes")
        .toBe(validUser.confirmPassword);
    }
  );

  it('Expect form on submit to trigger SaveAccount', () => {
    spyOn(fixture.componentInstance, 'saveAccount');
    const form = fixture.debugElement.query(By.css('form'))
    form.triggerEventHandler('submit');
    fixture.detectChanges();
    expect(fixture.componentInstance.saveAccount)
      .withContext("SaveAccount method should have been called")
      .toHaveBeenCalled();
  });

  it('Display username and password error message when fields are blank', () => {
    updateFormUsingEvent(blankUser.username, blankUser.password, blankUser.email, blankUser.confirmPassword);
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    const usernameErrorSpan = errorSpans[0];
    const emailErrorSpan = errorSpans[1];
    const passwordErrorSpan = errorSpans[2];
    const confirmPasswordErrorSpan = errorSpans[3];
    
    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext("Username span error should be filled")
      .toContain("Ingresar nombre de usuario");

    expect(emailErrorSpan.nativeElement.innerHTML)
      .withContext("Email span error should be filled")
      .toContain("Ingresar correo");

    expect(passwordErrorSpan.nativeElement.innerHTML)
      .withContext("Password span error should be filled")
      .toContain("Ingresar contraseña");

    expect(confirmPasswordErrorSpan.nativeElement.innerHTML)
      .withContext("Confirm password span error should be filled")
      .toContain("Confirmar contraseña");


    expect(fixture.componentInstance.displayMessage["username"])
      .withContext("Username displayMessage should exist")
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage["email"])
      .withContext("Email displayMessage should exist")
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage["password"])
      .withContext("Password displayMessage should exist")
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage["confirmPassword"])
      .withContext("Confirm password displayMessage should exist")
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage["username"])
      .withContext("Should displayMessage error for username")
      .toContain("Ingresar nombre de usuario");
    expect(fixture.componentInstance.displayMessage["password"])
      .withContext("Should displayMessage error for password")
      .toContain("Ingresar contraseña");
    expect(fixture.componentInstance.displayMessage["email"])
      .withContext("Password displayMessage should exist")
      .toContain("Ingresar correo");
    expect(fixture.componentInstance.displayMessage["confirmPassword"])
      .withContext("Confirm password displayMessage should exist")
      .toContain("Confirmar contraseña");
  });

  it('Display password match error message when passwords are different', () => {
    updateFormUsingEvent(invalidPasswordUser.username, invalidPasswordUser.password, invalidPasswordUser.email, invalidPasswordUser.confirmPassword);
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    const passwordMatch = errorSpans[3];

    expect(passwordMatch.nativeElement.innerHTML)
      .withContext("Confirm password span error should be filled")
      .toContain("Las contraseñas no coinciden");

    expect(fixture.componentInstance.displayMessage["passwordMatch"])
      .withContext("Should displayMessage error for password match")
      .toEqual("Las contraseñas no coinciden");
  });

  it('Shouldn\'t display username and password error message when fields are filled', () => {
    updateFormUsingEvent(validUser.username, validUser.password, validUser.email, validUser.confirmPassword);
    fixture.detectChanges();
    const errorSpans = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    const usernameErrorSpan = errorSpans[0];
    const emailErrorSpan = errorSpans[1];
    const passwordErrorSpan = errorSpans[2];
    const confirmPasswordErrorSpan = errorSpans[3];
    
    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext("Username span error should be filled")
      .not.toContain("Ingresar nombre de usuario");

    expect(emailErrorSpan.nativeElement.innerHTML)
      .withContext("Email span error should be filled")
      .not.toContain("Ingresar correo");

    expect(passwordErrorSpan.nativeElement.innerHTML)
      .withContext("Password span error should be filled")
      .not.toContain("Ingresar contraseña");

    expect(confirmPasswordErrorSpan.nativeElement.innerHTML)
      .withContext("Confirm password span error should be filled")
      .not.toContain("Confirmar contraseña");


    expect(fixture.componentInstance.displayMessage["username"])
      .withContext("Username displayMessage should exist")
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage["email"])
      .withContext("Email displayMessage should exist")
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage["password"])
      .withContext("Password displayMessage should exist")
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage["confirmPassword"])
      .withContext("Confirm password displayMessage should exist")
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage["username"])
      .withContext("Should displayMessage error for username")
      .not.toContain("Ingresar nombre de usuario");
    expect(fixture.componentInstance.displayMessage["password"])
      .withContext("Should displayMessage error for password")
      .not.toContain("Ingresar contraseña");
    expect(fixture.componentInstance.displayMessage["email"])
      .withContext("Password displayMessage should exist")
      .not.toContain("Ingresar correo");
    expect(fixture.componentInstance.displayMessage["confirmPassword"])
      .withContext("Confirm password displayMessage should exist")
      .not.toContain("Confirmar contraseña");
  });
});