import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  fullUserMock,
  messageResponseMock,
  searchUserMock,
  upsertUserMock,
  userDropdownDataMock,
  userEventsInfoMock,
  userProfileMock,
  userProfilePhotoMock,
} from 'src/tests/mocks/mocks';

const fullUserMockCopy = deepCopy(fullUserMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);
const searchUserMockCopy = deepCopy(searchUserMock);
const upsertUserMockCopy = deepCopy(upsertUserMock);
const userDropdownDataMockCopy = deepCopy(userDropdownDataMock);
const userEventsInfoMockCopy = deepCopy(userEventsInfoMock);
const userProfileMockCopy = deepCopy(userProfileMock);
const userProfilePhotoMockCopy = deepCopy(userProfilePhotoMock);

describe('Users Service', () => {
  let usersService: UsersService;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UsersService', [
      'getAllUsers',
      'getUsersDropdownData',
      'getUserById',
      'createUser',
      'updateUser',
      'deleteUser',
      'updateProfile',
      'getUserProfile',
      'checkUsername',
      'uploadProfilePhoto',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: UsersService, useValue: spy }],
    });

    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
  });

  it('should be created', () => {
    usersService = TestBed.inject(UsersService);
    expect(usersService)
      .withContext('Expected Users Service to have been created')
      .toBeTruthy();
  });

  it('should call getAllUsers', () => {
    usersServiceSpy.getAllUsers.and.returnValue(of([userEventsInfoMockCopy]));

    usersServiceSpy.getAllUsers().subscribe((response) => {
      expect(response).toEqual([userEventsInfoMockCopy]);
    });

    expect(usersServiceSpy.getAllUsers)
      .withContext('Expected getAllUsers to have been called')
      .toHaveBeenCalledOnceWith();
  });

  it('should call getUsersDropdownData', () => {
    usersServiceSpy.getUsersDropdownData.and.returnValue(
      of([userDropdownDataMockCopy])
    );

    usersServiceSpy.getUsersDropdownData().subscribe((response) => {
      expect(response).toEqual([userDropdownDataMockCopy]);
      expect(response.length).toEqual(1);
      expect(response[0].id).toEqual(fullUserMockCopy.id);
    });

    expect(usersServiceSpy.getUsersDropdownData)
      .withContext('Expected getUsersDropdownData to have been called')
      .toHaveBeenCalledOnceWith();
  });

  it('should call getUserById', () => {
    usersServiceSpy.getUserById.and.returnValue(of(searchUserMockCopy));

    usersServiceSpy.getUserById(fullUserMockCopy.id).subscribe((response) => {
      expect(response).toEqual(searchUserMockCopy);
      expect(response.id).toEqual(fullUserMockCopy.id);
    });

    expect(usersServiceSpy.getUserById)
      .withContext('Expected getUserById to have been called')
      .toHaveBeenCalledOnceWith(fullUserMockCopy.id);
  });

  it('should call createUser', () => {
    usersServiceSpy.createUser.and.returnValue(of(messageResponseMockCopy));

    usersServiceSpy.createUser(upsertUserMockCopy).subscribe((response) => {
      expect(response).toEqual(messageResponseMockCopy);
    });

    expect(usersServiceSpy.createUser)
      .withContext('Expected createUser to have been called')
      .toHaveBeenCalledOnceWith(upsertUserMockCopy);
  });

  it('should call updateUser', () => {
    usersServiceSpy.updateUser.and.returnValue(of(messageResponseMockCopy));

    usersServiceSpy
      .updateUser(upsertUserMockCopy, upsertUserMockCopy.id)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMockCopy);
      });

    expect(usersServiceSpy.updateUser)
      .withContext('Expected updateUser to have been called')
      .toHaveBeenCalledOnceWith(upsertUserMockCopy, upsertUserMockCopy.id);
  });

  it('should call deleteUser', () => {
    usersServiceSpy.deleteUser.and.returnValue(of(messageResponseMockCopy));

    usersServiceSpy.deleteUser(fullUserMockCopy.id).subscribe((response) => {
      expect(response).toEqual(messageResponseMockCopy);
    });

    expect(usersServiceSpy.deleteUser)
      .withContext('Expected deleteUser to have been called')
      .toHaveBeenCalledOnceWith(fullUserMockCopy.id);
  });

  it('should call updateProfile', () => {
    usersServiceSpy.updateProfile.and.returnValue(of(messageResponseMockCopy));

    usersServiceSpy.updateProfile(userProfileMockCopy).subscribe((response) => {
      expect(response).toEqual(messageResponseMockCopy);
    });

    expect(usersServiceSpy.updateProfile)
      .withContext('Expected updateProfile to have been called')
      .toHaveBeenCalledOnceWith(userProfileMockCopy);
  });

  it('should call getUserProfile', () => {
    usersServiceSpy.getUserProfile.and.returnValue(of(userProfileMockCopy));

    usersServiceSpy.getUserProfile(fullUserMockCopy.id).subscribe((response) => {
      expect(response).toEqual(userProfileMockCopy);
      expect(response.id).toEqual(fullUserMockCopy.id);
    });

    expect(usersServiceSpy.getUserProfile)
      .withContext('Expected getUserProfile to have been called')
      .toHaveBeenCalledOnceWith(fullUserMockCopy.id);
  });

  it('should call checkUsername', () => {
    usersServiceSpy.checkUsername.and.returnValue(of(true));

    usersServiceSpy
      .checkUsername(fullUserMockCopy.username)
      .subscribe((response) => {
        expect(response).toEqual(true);
      });

    expect(usersServiceSpy.checkUsername)
      .withContext('Expected checkUsername to have been called')
      .toHaveBeenCalledOnceWith(fullUserMockCopy.username);
  });

  it('should call uploadProfilePhoto', () => {
    usersServiceSpy.uploadProfilePhoto.and.returnValue(of(messageResponseMockCopy));

    usersServiceSpy
      .uploadProfilePhoto(userProfilePhotoMockCopy)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMockCopy);
      });

    expect(usersServiceSpy.uploadProfilePhoto)
      .withContext('Expected uploadProfilePhoto to have been called')
      .toHaveBeenCalledOnceWith(userProfilePhotoMockCopy);
  });
});
