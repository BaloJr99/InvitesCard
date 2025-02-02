import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { UsersService } from 'src/app/core/services/users.service';
import { ProfileModalComponent } from 'src/app/dashboard/profile/profile-modal/profile-modal.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { messageResponseMock } from 'src/tests/mocks/mocks';

const messageResponseMockCopy = deepCopy(messageResponseMock);

describe('Profile Modal Component (Integrated Test)', () => {
  let fixture: ComponentFixture<ProfileModalComponent>;
  let userServiceSpy: jasmine.SpyObj<UsersService>;
  let fileReaderServiceSpy: jasmine.SpyObj<FileReaderService>;

  const uploadFile = (file: File) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const fileInput = fixture.debugElement.query(By.css('#photoFiles'));
    fileInput.nativeElement.files = dataTransfer.files;
    fileInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const userSpy = jasmine.createSpyObj('UserService', ['uploadProfilePhoto']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', [
      'getBase64',
    ]);

    TestBed.configureTestingModule({
      declarations: [ProfileModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UsersService, useValue: userSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
      ],
    });

    userServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
    fileReaderServiceSpy = TestBed.inject(
      FileReaderService
    ) as jasmine.SpyObj<FileReaderService>;
  }));

  beforeEach(() => {
    userServiceSpy.uploadProfilePhoto.and.returnValue(
      of(messageResponseMockCopy)
    );
    fileReaderServiceSpy.getBase64.and.returnValue(of('image'));
    fixture = TestBed.createComponent(ProfileModalComponent);
    fixture.detectChanges();
  });

  it('should call uploadProfilePhoto when file is being updated and saved', () => {
    uploadFile(new File([''], 'test.jpg', { type: 'image/jpg' }));

    const modalFooter = fixture.debugElement.query(By.css('.modal-footer'));
    const buttons = modalFooter.queryAll(By.css('button'));
    const saveButton = buttons[1];

    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(userServiceSpy.uploadProfilePhoto)
      .withContext('uploadProfilePhoto should be called')
      .toHaveBeenCalled();
  });

  it('should call getBase64 when saving an uploaded photo', () => {
    uploadFile(new File([''], 'filename', { type: 'image/png' }));

    const modalFooter = fixture.debugElement.query(By.css('.modal-footer'));
    const buttons = modalFooter.queryAll(By.css('button'));
    const saveButton = buttons[1];

    saveButton.nativeElement.click();

    expect(fileReaderServiceSpy.getBase64)
      .withContext('getBase64 should be called')
      .toHaveBeenCalled();
  });
});
