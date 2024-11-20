import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { UsersService } from 'src/app/core/services/users.service';
import { ProfileModalComponent } from 'src/app/dashboard/profile/profile-modal/profile-modal.component';

describe('Profile Modal Component (Shallow Test)', () => {
  let fixture: ComponentFixture<ProfileModalComponent>;

  const uploadFile = (file: File) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const fileInput = fixture.debugElement.query(By.css('#photoFiles'));
    fileInput.nativeElement.files = dataTransfer.files;
    fileInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const userSpy = jasmine.createSpyObj('UserService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);

    TestBed.configureTestingModule({
      declarations: [ProfileModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UsersService, useValue: userSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileModalComponent);
    fixture.detectChanges();
  });

  it(`shouldn't display image-container and should display an input with label, and 2 buttons (save and close)`, () => {
    const modalBody = fixture.debugElement.query(By.css('.modal-body'));
    const modalFooter = fixture.debugElement.query(By.css('.modal-footer'));
    const imageContainer = modalBody.query(By.css('#image-container'));
    const label = modalBody.query(By.css('label'));
    const fileInputs = modalBody.query(By.css('input[type="file"]'));
    const buttons = modalFooter.queryAll(By.css('button'));

    expect(imageContainer.styles['display'])
      .withContext(`imageContainer shouldn't be displayed`)
      .toBe('none');

    expect(label).withContext('label should be displayed').toBeDefined();

    expect(label.nativeElement.textContent)
      .withContext('label should have the correct text')
      .toContain('Seleccionar foto');

    expect(fileInputs)
      .withContext('fileInputs should be displayed')
      .toBeTruthy();

    expect(buttons[0].nativeElement.textContent)
      .withContext('close button should have the correct text')
      .toContain('Cerrar');

    expect(buttons[1].nativeElement.textContent)
      .withContext('save button should have the correct text')
      .toContain('Guardar');
  });

  it('should call onPhotosChange when uploading a photo', () => {
    spyOn(fixture.componentInstance, 'onPhotoChange');

    const uploadForm = fixture.debugElement.query(By.css('.upload-form'));
    const fileInput = uploadForm.query(By.css('#photoFiles'));

    fileInput.nativeElement.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.onPhotoChange)
      .withContext('onPhotoChange should be called')
      .toHaveBeenCalled();
  });

  it('should display an image-container if there are any images', () => {
    uploadFile(new File([''], 'filename', { type: 'image/png' }));

    const imageContainer = fixture.debugElement.query(
      By.css('#image-container')
    );

    expect(imageContainer.styles['display'])
      .withContext('imageContainer should be displayed')
      .toBe('block');
  });

  it('should call saveProfilePhoto when saving an uploaded photo', () => {
    spyOn(fixture.componentInstance, 'saveProfilePhoto');
    uploadFile(new File([''], 'filename', { type: 'image/png' }));

    const modalFooter = fixture.debugElement.query(By.css('.modal-footer'));
    const buttons = modalFooter.queryAll(By.css('button'));
    const saveButton = buttons[1];

    saveButton.nativeElement.click();

    expect(fixture.componentInstance.saveProfilePhoto)
      .withContext('saveProfilePhoto should be called')
      .toHaveBeenCalled();
  });
});
