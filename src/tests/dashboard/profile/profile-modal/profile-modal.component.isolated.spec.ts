import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { UsersService } from 'src/app/core/services/users.service';
import { ProfileModalComponent } from 'src/app/dashboard/profile/profile-modal/profile-modal.component';

describe('Profile Modal Component (Isolated Test)', () => {
  let component: ProfileModalComponent;
  const userSpy = jasmine.createSpyObj('UserService', ['']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
  const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: UsersService, useValue: userSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
      ],
    });
    component = TestBed.createComponent(ProfileModalComponent).componentInstance;
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
