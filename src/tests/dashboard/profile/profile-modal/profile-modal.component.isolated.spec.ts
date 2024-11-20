import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProfileModalComponent } from 'src/app/dashboard/profile/profile-modal/profile-modal.component';

describe('Profile Modal Component (Isolated Test)', () => {
  let component: ProfileModalComponent;

  beforeEach(() => {
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const userSpy = jasmine.createSpyObj('UserService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);

    component = new ProfileModalComponent(
      new FormBuilder(),
      loaderSpy,
      fileReaderSpy,
      userSpy,
      toastrSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.userId)
      .withContext('should have userId to be an empty string')
      .toEqual('');

    expect(component.updateProfilePhoto)
      .withContext(
        'should have updateProfilePhoto to be an instance of EventEmitter'
      )
      .toBeInstanceOf(EventEmitter);

    expect(component.profilePhotoForm)
      .withContext('should have profilePhotoForm to be defined')
      .toBeDefined();
  });
});
