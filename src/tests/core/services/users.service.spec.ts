import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';
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
    usersServiceSpy.getAllUsers.and.returnValue(of([userEventsInfoMock]));

    usersServiceSpy.getAllUsers().subscribe((response) => {
      expect(response).toEqual([userEventsInfoMock]);
    });

    expect(usersServiceSpy.getAllUsers)
      .withContext('Expected getAllUsers to have been called')
      .toHaveBeenCalledOnceWith();
  });

  it('should call getUsersDropdownData', () => {
    usersServiceSpy.getUsersDropdownData.and.returnValue(
      of([userDropdownDataMock])
    );

    usersServiceSpy.getUsersDropdownData().subscribe((response) => {
      expect(response).toEqual([userDropdownDataMock]);
      expect(response.length).toEqual(1);
      expect(response[0].id).toEqual(fullUserMock.id);
    });

    expect(usersServiceSpy.getUsersDropdownData)
      .withContext('Expected getUsersDropdownData to have been called')
      .toHaveBeenCalledOnceWith();
  });

  it('should call getUserById', () => {
    usersServiceSpy.getUserById.and.returnValue(of(searchUserMock));

    usersServiceSpy.getUserById(fullUserMock.id).subscribe((response) => {
      expect(response).toEqual(searchUserMock);
      expect(response.id).toEqual(fullUserMock.id);
    });

    expect(usersServiceSpy.getUserById)
      .withContext('Expected getUserById to have been called')
      .toHaveBeenCalledOnceWith(fullUserMock.id);
  });

  it('should call createUser', () => {
    usersServiceSpy.createUser.and.returnValue(of(messageResponseMock));

    usersServiceSpy.createUser(upsertUserMock).subscribe((response) => {
      expect(response).toEqual(messageResponseMock);
    });

    expect(usersServiceSpy.createUser)
      .withContext('Expected createUser to have been called')
      .toHaveBeenCalledOnceWith(upsertUserMock);
  });

  it('should call updateUser', () => {
    usersServiceSpy.updateUser.and.returnValue(of(messageResponseMock));

    usersServiceSpy
      .updateUser(upsertUserMock, upsertUserMock.id)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMock);
      });

    expect(usersServiceSpy.updateUser)
      .withContext('Expected updateUser to have been called')
      .toHaveBeenCalledOnceWith(upsertUserMock, upsertUserMock.id);
  });

  it('should call deleteUser', () => {
    usersServiceSpy.deleteUser.and.returnValue(of(messageResponseMock));

    usersServiceSpy.deleteUser(fullUserMock.id).subscribe((response) => {
      expect(response).toEqual(messageResponseMock);
    });

    expect(usersServiceSpy.deleteUser)
      .withContext('Expected deleteUser to have been called')
      .toHaveBeenCalledOnceWith(fullUserMock.id);
  });

  it('should call updateProfile', () => {
    usersServiceSpy.updateProfile.and.returnValue(of(messageResponseMock));

    usersServiceSpy.updateProfile(userProfileMock).subscribe((response) => {
      expect(response).toEqual(messageResponseMock);
    });

    expect(usersServiceSpy.updateProfile)
      .withContext('Expected updateProfile to have been called')
      .toHaveBeenCalledOnceWith(userProfileMock);
  });

  it('should call getUserProfile', () => {
    usersServiceSpy.getUserProfile.and.returnValue(of(userProfileMock));

    usersServiceSpy.getUserProfile(fullUserMock.id).subscribe((response) => {
      expect(response).toEqual(userProfileMock);
      expect(response.id).toEqual(fullUserMock.id);
    });

    expect(usersServiceSpy.getUserProfile)
      .withContext('Expected getUserProfile to have been called')
      .toHaveBeenCalledOnceWith(fullUserMock.id);
  });

  it('should call checkUsername', () => {
    usersServiceSpy.checkUsername.and.returnValue(of(true));

    usersServiceSpy
      .checkUsername(fullUserMock.username)
      .subscribe((response) => {
        expect(response).toEqual(true);
      });

    expect(usersServiceSpy.checkUsername)
      .withContext('Expected checkUsername to have been called')
      .toHaveBeenCalledOnceWith(fullUserMock.username);
  });

  it('should call uploadProfilePhoto', () => {
    usersServiceSpy.uploadProfilePhoto.and.returnValue(of(messageResponseMock));

    usersServiceSpy
      .uploadProfilePhoto(userProfilePhotoMock)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMock);
      });

    expect(usersServiceSpy.uploadProfilePhoto)
      .withContext('Expected uploadProfilePhoto to have been called')
      .toHaveBeenCalledOnceWith(userProfilePhotoMock);
  });
});
