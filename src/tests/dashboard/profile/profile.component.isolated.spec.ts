import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { UsersService } from 'src/app/core/services/users.service';
import { ProfileComponent } from 'src/app/dashboard/profile/profile.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { userProfileMock } from 'src/tests/mocks/mocks';

const userProfileMockCopy = deepCopy(userProfileMock);

describe('Profile Component (Isolated Test)', () => {
  let component: ProfileComponent;
  const userSpy = jasmine.createSpyObj('UserService', ['']);
  const authSpy = jasmine.createSpyObj('AuthService', ['']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
  const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', [
    'getTokenValues',
  ]);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

  const updateForm = (
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    gender: string
  ) => {
    component.createProfileForm.controls['id'].setValue(id);
    component.createProfileForm.controls['username'].setValue(username);
    component.createProfileForm.controls['firstName'].setValue(firstName);
    component.createProfileForm.controls['lastName'].setValue(lastName);
    component.createProfileForm.controls['phoneNumber'].setValue(phoneNumber);
    component.createProfileForm.controls['email'].setValue(email);
    component.createProfileForm.controls['gender'].setValue(gender);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: UsersService, useValue: userSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    });

    component = TestBed.createComponent(ProfileComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.showChangePassword)
      .withContext('The showChangePassword should be false')
      .toBeFalse();

    expect(component.createProfileForm)
      .withContext('The createProfileForm should be defined')
      .toBeDefined();
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', '', '', '', '', '', '');
    expect(component.createProfileForm.invalid)
      .withContext('Form should be invalid when fields are empty')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(
      userProfileMockCopy.id,
      userProfileMockCopy.username,
      userProfileMockCopy.firstName,
      userProfileMockCopy.lastName,
      userProfileMockCopy.phoneNumber,
      userProfileMockCopy.email,
      userProfileMockCopy.gender
    );

    expect(component.createProfileForm.valid)
      .withContext('Form should be valid')
      .toBeTrue();
  });

  it('should have username, firstName, lastName, phoneNumber, email and gender in the createProfileForm', () => {
    const username = component.createProfileForm.controls['username'];
    const firstName = component.createProfileForm.controls['firstName'];
    const lastName = component.createProfileForm.controls['lastName'];
    const phoneNumber = component.createProfileForm.controls['phoneNumber'];
    const email = component.createProfileForm.controls['email'];
    const gender = component.createProfileForm.controls['gender'];

    expect(username.valid)
      .withContext('Username should be invalid')
      .toBeFalsy();
    expect(username.errors?.['required'])
      .withContext('Username should be required')
      .toBeTruthy();

    expect(firstName.valid)
      .withContext('First Name should be invalid')
      .toBeFalsy();
    expect(firstName.errors?.['required'])
      .withContext('First Name should be required')
      .toBeTruthy();

    expect(lastName.valid)
      .withContext('Last Name should be invalid')
      .toBeFalsy();
    expect(lastName.errors?.['required'])
      .withContext('Last Name should be required')
      .toBeTruthy();

    expect(phoneNumber.valid)
      .withContext('Phone Number should be invalid')
      .toBeFalsy();
    expect(phoneNumber.errors?.['required'])
      .withContext('Phone Number should be required')
      .toBeTruthy();

    expect(email.valid).withContext('Email should be invalid').toBeFalsy();
    expect(email.errors?.['required'])
      .withContext('Email should be required')
      .toBeTruthy();

    expect(gender.valid).withContext('Gender should be invalid').toBeFalsy();
    expect(gender.errors?.['required'])
      .withContext('Gender should be required')
      .toBeTruthy();
  });
});
