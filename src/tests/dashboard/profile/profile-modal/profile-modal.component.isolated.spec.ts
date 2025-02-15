import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProfileModalComponent } from 'src/app/dashboard/profile/profile-modal/profile-modal.component';

describe('Profile Modal Component (Isolated Test)', () => {
  let component: ProfileModalComponent;

  beforeEach(() => {
    const userSpy = jasmine.createSpyObj('UserService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);

    component = new ProfileModalComponent(
      new FormBuilder(),
      fileReaderSpy,
      userSpy,
      toastrSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.updateProfilePhoto)
      .withContext(
        'should have updateProfilePhoto to be an instance of EventEmitter'
      )
      .toBeInstanceOf(EventEmitter);

    expect(component.closeModal)
      .withContext('should have closeModal to be an instance of EventEmitter')
      .toBeInstanceOf(EventEmitter);

    expect(component.profilePhotoForm)
      .withContext('should have profilePhotoForm to be defined')
      .toBeDefined();
  });
});
