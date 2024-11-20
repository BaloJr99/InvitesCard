import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { UsersService } from 'src/app/core/services/users.service';
import { ProfileComponent } from 'src/app/dashboard/profile/profile.component';
import { userProfileMock } from 'src/tests/mocks/mocks';

describe('Profile Component (Shallow Test)', () => {
  let fixture: ComponentFixture<ProfileComponent>;

  const updateFormUsingEvent = (
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    gender: string
  ) => {
    const form = fixture.debugElement.query(By.css('form'));
    const usernameInput = form.query(By.css('#username'));
    const firstNameInput = form.query(By.css('#firstName'));
    const lastNameInput = form.query(By.css('#lastName'));
    const phoneNumberInput = form.query(By.css('#phoneNumber'));
    const emailInput = form.query(By.css('#email'));
    const genderSelect = form.query(By.css('#gender'));

    usernameInput.nativeElement.value = username;
    usernameInput.nativeElement.dispatchEvent(new Event('input'));

    firstNameInput.nativeElement.value = firstName;
    firstNameInput.nativeElement.dispatchEvent(new Event('input'));

    lastNameInput.nativeElement.value = lastName;
    lastNameInput.nativeElement.dispatchEvent(new Event('input'));

    phoneNumberInput.nativeElement.value = phoneNumber;
    phoneNumberInput.nativeElement.dispatchEvent(new Event('input'));

    emailInput.nativeElement.value = email;
    emailInput.nativeElement.dispatchEvent(new Event('input'));

    genderSelect.nativeElement.value = gender;
    genderSelect.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const usersSpy = jasmine.createSpyObj('UsersService', ['']);
    const authSpy = jasmine.createSpyObj('AuthService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', {
      getTokenValues: userProfileMock,
    });

    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                userProfile: {
                  id: userProfileMock.id,
                  username: userProfileMock.username,
                  firstName: '',
                  lastName: '',
                  phoneNumber: '',
                  email: userProfileMock.email,
                  gender: '',
                },
              },
              paramMap: convertToParamMap({ id: userProfileMock.id }),
            },
          },
        },
        { provide: UsersService, useValue: usersSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TokenStorageService, useValue: tokenStorageSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
  });

  it('created a card with profile-image (generic user photo, add profile photo)', () => {
    const card = fixture.debugElement.query(By.css('.profile-aside .card'));

    const icon = card.query(By.css('i'));
    const button = card.query(By.css('button'));

    expect(icon).withContext('Icon should exist').not.toBeNull();
    expect(button).withContext('Button should exist').not.toBeNull();
  });

  it('created a card with profile-info (profile-name, profile-email, profile-phone, button)', () => {
    const card = fixture.debugElement.query(By.css('.profile-aside .card'));

    const profileInfo = card.query(By.css('.profile-info'));
    const profileData = profileInfo.queryAll(By.css('p'));
    const profileName = profileData[0];
    const profileEmail = profileData[1];
    const button = profileInfo.query(By.css('button'));
    const buttonText = button.query(By.css('span'));

    expect(profileInfo).withContext('ProfileInfo should exist').not.toBeNull();

    expect(profileName).withContext('ProfileName should exist').not.toBeNull();
    expect(profileName.nativeElement.textContent)
      .withContext('ProfileName should contain username')
      .toContain('');

    expect(profileEmail)
      .withContext('ProfileEmail should exist')
      .not.toBeNull();
    expect(profileEmail.nativeElement.textContent)
      .withContext('ProfileEmail should contain email')
      .toBe(userProfileMock.email);

    expect(button).withContext('Button should exist').not.toBeNull();
    expect(buttonText.nativeElement.textContent)
      .withContext('Button should contain text')
      .toContain('Cambiar mi contraseña');
  });

  it('created personal information form with firstName, lastName, username, gender, email, phoneNumber and 2 buttons (save and cancel)', () => {
    const form = fixture.debugElement.query(By.css('form'));

    const firstNameInput = form.query(By.css('#firstName'));
    const firstNameLabel = form.query(By.css('label[for="firstName"]'));

    const lastNameInput = form.query(By.css('#lastName'));
    const lastNameLabel = form.query(By.css('label[for="lastName"]'));

    const usernameInput = form.query(By.css('#username'));
    const usernameLabel = form.query(By.css('label[for="username"]'));

    const genderSelect = form.query(By.css('#gender'));
    const genderLabel = form.query(By.css('label[for="gender"]'));

    const emailInput = form.query(By.css('#email'));
    const emailLabel = form.query(By.css('label[for="email"]'));

    const phoneNumberInput = form.query(By.css('#phoneNumber'));
    const phoneNumberLabel = form.query(By.css('label[for="phoneNumber"]'));

    const buttons = form.queryAll(By.css('button'));

    expect(form).withContext('Form should exist').not.toBeNull();
    expect(firstNameInput)
      .withContext('FirstName input should exist')
      .not.toBeNull();
    expect(firstNameLabel.nativeElement.textContent)
      .withContext('FirstName label should exist')
      .toBe('Nombre');

    expect(lastNameInput)
      .withContext('LastName input should exist')
      .not.toBeNull();
    expect(lastNameLabel.nativeElement.textContent)
      .withContext('LastName label should exist')
      .toBe('Apellidos');

    expect(usernameInput)
      .withContext('Username input should exist')
      .not.toBeNull();
    expect(usernameLabel.nativeElement.textContent)
      .withContext('Username label should exist')
      .toBe('Usuario');

    expect(genderSelect)
      .withContext('Gender select should exist')
      .not.toBeNull();
    expect(genderLabel.nativeElement.textContent)
      .withContext('Gender label should exist')
      .toBe('Genero');

    expect(emailInput).withContext('Email input should exist').not.toBeNull();
    expect(emailLabel.nativeElement.textContent)
      .withContext('Email label should exist')
      .toBe('Correo');

    expect(phoneNumberInput)
      .withContext('PhoneNumber input should exist')
      .not.toBeNull();
    expect(phoneNumberLabel.nativeElement.textContent)
      .withContext('PhoneNumber label should exist')
      .toBe('Número de teléfono');

    expect(buttons.length).withContext('Should have 2 buttons').toBe(2);
    expect(buttons[0].nativeElement.textContent)
      .withContext('First button should contain text')
      .toContain('Guardar Cambios');
    expect(buttons[1].nativeElement.textContent)
      .withContext('Second button should contain text')
      .toContain('Cancelar Cambios');
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(
      userProfileMock.id,
      userProfileMock.username,
      userProfileMock.firstName,
      userProfileMock.lastName,
      userProfileMock.phoneNumber,
      userProfileMock.email,
      userProfileMock.gender
    );

    const controls = fixture.componentInstance.createProfileForm.controls;

    expect(controls['username'].value)
      .withContext('username control should be filled when input changes')
      .toBe(userProfileMock.username);
    expect(controls['firstName'].value)
      .withContext('firstName control should be filled when input changes')
      .toBe(userProfileMock.firstName);
    expect(controls['lastName'].value)
      .withContext('lastName control should be filled when input changes')
      .toBe(userProfileMock.lastName);
    expect(controls['phoneNumber'].value)
      .withContext('phoneNumber control should be filled when input changes')
      .toBe(userProfileMock.phoneNumber);
    expect(controls['email'].value)
      .withContext('email control should be filled when input changes')
      .toBe(userProfileMock.email);

    expect(controls['gender'].value)
      .withContext('gender control should be filled when select changes')
      .toBe(userProfileMock.gender);
  });

  it('Expect save changes to trigger saveProfile', () => {
    spyOn(fixture.componentInstance, 'saveProfile');
    const form = fixture.debugElement.query(By.css('form'));
    const buttons = form.queryAll(By.css('button'));
    buttons[0].nativeElement.click();

    expect(fixture.componentInstance.saveProfile)
      .withContext('save profile method should have been called')
      .toHaveBeenCalled();
  });

  it('Display firstName, lastName, username, gender, email and phoneNumber error message when fields are blank', () => {
    updateFormUsingEvent('', '', '', '', '', '', '');

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const firstNameErrorSpan = errorSpans[0];
    const lastNameErrorSpan = errorSpans[1];
    const usernameErrorSpan = errorSpans[2];
    const genderErrorSpan = errorSpans[3];
    const emailErrorSpan = errorSpans[4];
    const phoneNumberErrorSpan = errorSpans[5];

    expect(firstNameErrorSpan.nativeElement.innerHTML)
      .withContext('First name span for error should be filled')
      .toContain('El nombre es requerido');

    expect(lastNameErrorSpan.nativeElement.innerHTML)
      .withContext('Last name span for error should be filled')
      .toContain('El apellido es requerido');

    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext('Username span for error should be filled')
      .toContain('El nombre de usuario es requerido');

    expect(genderErrorSpan.nativeElement.innerHTML)
      .withContext('Gender span for error should be filled')
      .toContain('El género es requerido');

    expect(emailErrorSpan.nativeElement.innerHTML)
      .withContext('Email span for error should be filled')
      .toContain('El correo electrónico es requerido');

    expect(phoneNumberErrorSpan.nativeElement.innerHTML)
      .withContext('Phone number span for error should be filled')
      .toContain('El número de teléfono es requerido');

    expect(fixture.componentInstance.displayMessage['firstName'])
      .withContext('FirstName displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['lastName'])
      .withContext('LastName displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['username'])
      .withContext('Username displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['gender'])
      .withContext('Gender displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['email'])
      .withContext('Email displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['phoneNumber'])
      .withContext('PhoneNumber displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['firstName'])
      .withContext('Should displayMessage error for firstName')
      .toContain('El nombre es requerido');
    expect(fixture.componentInstance.displayMessage['lastName'])
      .withContext('Should displayMessage error for lastName')
      .toContain('El apellido es requerido');
    expect(fixture.componentInstance.displayMessage['username'])
      .withContext('Should displayMessage error for username')
      .toContain('El nombre de usuario es requerido');
    expect(fixture.componentInstance.displayMessage['gender'])
      .withContext('Should displayMessage error for gender')
      .toContain('El género es requerido');
    expect(fixture.componentInstance.displayMessage['email'])
      .withContext('Should displayMessage error for email')
      .toContain('El correo electrónico es requerido');
    expect(fixture.componentInstance.displayMessage['phoneNumber'])
      .withContext('Should displayMessage error for phoneNumber')
      .toContain('El número de teléfono es requerido');
  });

  it("Shouldn't display password and confirmPassword error message when fields are filled", () => {
    updateFormUsingEvent(
      userProfileMock.id,
      userProfileMock.username,
      userProfileMock.firstName,
      userProfileMock.lastName,
      userProfileMock.phoneNumber,
      userProfileMock.email,
      userProfileMock.gender
    );
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const firstNameErrorSpan = errorSpans[0];
    const lastNameErrorSpan = errorSpans[1];
    const usernameErrorSpan = errorSpans[2];
    const genderErrorSpan = errorSpans[3];
    const emailErrorSpan = errorSpans[4];
    const phoneNumberErrorSpan = errorSpans[5];

    expect(firstNameErrorSpan.nativeElement.innerHTML)
      .withContext(`First name span for error shouldn't be filled`)
      .not.toContain('El nombre es requerido');

    expect(lastNameErrorSpan.nativeElement.innerHTML)
      .withContext(`Last name span for error shouldn't be filled`)
      .not.toContain('El apellido es requerido');

    expect(usernameErrorSpan.nativeElement.innerHTML)
      .withContext(`Username span for error shouldn't be filled`)
      .not.toContain('El nombre de usuario es requerido');

    expect(genderErrorSpan.nativeElement.innerHTML)
      .withContext(`Gender span for error shouldn't be filled`)
      .not.toContain('El género es requerido');

    expect(emailErrorSpan.nativeElement.innerHTML)
      .withContext(`Email span for error shouldn't be filled`)
      .not.toContain('El correo electrónico es requerido');

    expect(phoneNumberErrorSpan.nativeElement.innerHTML)
      .withContext(`Phone number span for error shouldn't be filled`)
      .not.toContain('El número de teléfono es requerido');

    expect(fixture.componentInstance.displayMessage['firstName'])
      .withContext('FirstName displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['lastName'])
      .withContext('LastName displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['username'])
      .withContext('Username displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['gender'])
      .withContext('Gender displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['email'])
      .withContext('Email displayMessage should exist')
      .toBeDefined();
    expect(fixture.componentInstance.displayMessage['phoneNumber'])
      .withContext('PhoneNumber displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['firstName'])
      .withContext(`Shouldn't displayMessage error for firstName`)
      .not.toContain('El nombre es requerido');
    expect(fixture.componentInstance.displayMessage['lastName'])
      .withContext(`Shouldn't displayMessage error for lastName`)
      .not.toContain('El apellido es requerido');
    expect(fixture.componentInstance.displayMessage['username'])
      .withContext(`Shouldn't displayMessage error for username`)
      .not.toContain('El nombre de usuario es requerido');
    expect(fixture.componentInstance.displayMessage['gender'])
      .withContext(`Shouldn't displayMessage error for gender`)
      .not.toContain('El género es requerido');
    expect(fixture.componentInstance.displayMessage['email'])
      .withContext(`Shouldn't displayMessage error for email`)
      .not.toContain('El correo electrónico es requerido');
    expect(fixture.componentInstance.displayMessage['phoneNumber'])
      .withContext(`Shouldn't displayMessage error for phoneNumber`)
      .not.toContain('El número de teléfono es requerido');
  });

  it('should call changePassword method when button is clicked', () => {
    spyOn(fixture.componentInstance, 'changePassword');
    const profileInfo = fixture.debugElement.query(
      By.css('.profile-info')
    );
    const button = profileInfo.query(By.css('button'));
    button.nativeElement.click();

    expect(fixture.componentInstance.changePassword)
      .withContext('change password method should have been called')
      .toHaveBeenCalled();
  });
});
