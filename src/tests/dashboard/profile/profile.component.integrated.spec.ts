import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { UsersService } from 'src/app/core/services/users.service';
import { ProfileModalComponent } from 'src/app/dashboard/profile/profile-modal/profile-modal.component';
import { ProfileComponent } from 'src/app/dashboard/profile/profile.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  messageResponseMock,
  userMock,
  userProfileMock,
} from 'src/tests/mocks/mocks';

const messageResponseMockCopy = deepCopy(messageResponseMock);
const userMockCopy = deepCopy(userMock);
const userProfileMockCopy = deepCopy(userProfileMock);

describe('Profile Component (Integrated Test)', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let tokenStorageServiceSpy: jasmine.SpyObj<TokenStorageService>;

  const updateFormUsingEvent = (
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    gender: string
  ) => {
    fixture.componentInstance.createProfileForm.patchValue({
      id,
    });
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

  beforeEach(async () => {
    const usersSpy = jasmine.createSpyObj('UsersService', [
      'updateProfile',
      'checkUsername',
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', [
      'sendResetPasswordToUser',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', [
      'getTokenValues',
    ]);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ValidationPipe,
        ValidationErrorPipe,
        ProfileComponent,
        ProfileModalComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                userProfile: {
                  id: userProfileMockCopy.id,
                  username: userProfileMockCopy.username,
                  firstName: '',
                  lastName: '',
                  phoneNumber: '',
                  email: userProfileMockCopy.email,
                  gender: '',
                },
              },
              paramMap: convertToParamMap({ id: userProfileMockCopy.id }),
            },
          },
        },
        { provide: UsersService, useValue: usersSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
      ],
    }).compileComponents();

    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    tokenStorageServiceSpy = TestBed.inject(
      TokenStorageService
    ) as jasmine.SpyObj<TokenStorageService>;

    tokenStorageServiceSpy.getTokenValues.and.returnValue(userMockCopy);
    usersServiceSpy.updateProfile.and.returnValue(of(messageResponseMockCopy));
    usersServiceSpy.checkUsername.and.returnValue(of(true));
    authServiceSpy.sendResetPasswordToUser.and.returnValue(
      of(messageResponseMockCopy)
    );

    fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
  });

  it('should call getTokenValues on init', () => {
    expect(tokenStorageServiceSpy.getTokenValues)
      .withContext(
        'getTokenValues from TokenStorageService should have been called'
      )
      .toHaveBeenCalled();
  });

  it('should call saveProfile on save button click', () => {
    updateFormUsingEvent(
      userProfileMockCopy.id,
      userProfileMockCopy.username,
      userProfileMockCopy.firstName,
      userProfileMockCopy.lastName,
      userProfileMockCopy.phoneNumber,
      userProfileMockCopy.email,
      userProfileMockCopy.gender
    );

    const form = fixture.debugElement.query(By.css('form'));
    const buttons = form.queryAll(By.css('button'));
    const saveButton = buttons[0];

    saveButton.nativeElement.click();

    expect(usersServiceSpy.updateProfile)
      .withContext('updateProfile from UsersService should have been called')
      .toHaveBeenCalled();
  });

  it('should call checkUsername when username is not the same', () => {
    updateFormUsingEvent(
      userProfileMockCopy.id,
      'newUsername',
      userProfileMockCopy.firstName,
      userProfileMockCopy.lastName,
      userProfileMockCopy.phoneNumber,
      userProfileMockCopy.email,
      userProfileMockCopy.gender
    );

    const form = fixture.debugElement.query(By.css('form'));
    const buttons = form.queryAll(By.css('button'));
    const saveButton = buttons[0];
    saveButton.nativeElement.click();

    expect(usersServiceSpy.checkUsername)
      .withContext('checkUsername from UsersService should have been called')
      .toHaveBeenCalled();
  });
});
