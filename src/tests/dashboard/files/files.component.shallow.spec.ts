import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { FilesService } from 'src/app/core/services/files.service';
import { FilesComponent } from 'src/app/dashboard/files/files.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  downloadFileMock,
  downloadImageMock,
  downloadMusicMock,
  dropdownEventsMock,
} from 'src/tests/mocks/mocks';

const downloadFileMockCopy = deepCopy(downloadFileMock);
const downloadImageMockCopy = deepCopy(downloadImageMock);
const downloadMusicMockCopy = deepCopy(downloadMusicMock);
const dropdownEventsMockCopy = deepCopy(dropdownEventsMock);

describe('Files Component (Shallow Test)', () => {
  let fixture: ComponentFixture<FilesComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let filesServiceSpy: jasmine.SpyObj<FilesService>;

  const selectEvent = (eventId: string) => {
    const eventSelect = fixture.debugElement.query(By.css('#event-select'));

    eventSelect.nativeElement.value = eventId;
    eventSelect.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
  };

  const uploadFile = (file: File) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const fileInput = fixture.debugElement.query(By.css('#photoFiles'));
    fileInput.nativeElement.files = dataTransfer.files;
    fileInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getDropdownEvents',
    ]);
    const filesSpy = jasmine.createSpyObj('FilesService', ['getFilesByEvent']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FilesComponent],
      providers: [
        { provide: EventsService, useValue: eventsSpy },
        { provide: FilesService, useValue: filesSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
        provideRouter([]),
      ],
    });

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;
    filesServiceSpy = TestBed.inject(
      FilesService
    ) as jasmine.SpyObj<FilesService>;
  }));

  beforeEach(() => {
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMockCopy));
    eventsServiceSpy.getDropdownEvents.and.returnValue(of([]));
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();
  });

  it('on init should start with only one select', () => {
    const selects = fixture.nativeElement.querySelectorAll('select');
    expect(selects.length).toBe(1);
  });

  it('should change select value to display uploadForm with two inputs and one button', () => {
    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    const uploadForm = fixture.debugElement.query(By.css('.upload-form'));
    const fileInputs = uploadForm.queryAll(By.css('input[type="file"]'));
    const buttons = uploadForm.queryAll(By.css('button'));

    expect(uploadForm)
      .withContext('uploadForm should be displayed')
      .toBeTruthy();

    expect(fileInputs.length)
      .withContext('fileInputs should be displayed')
      .toBe(2);

    expect(buttons.length).withContext('buttons should be displayed').toBe(1);
  });

  it('should change select value to trigger searchImages', () => {
    spyOn(fixture.componentInstance, 'searchImages');

    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    expect(fixture.componentInstance.searchImages)
      .withContext('searchImages should be called')
      .toHaveBeenCalled();
  });

  it('should change select value to trigger getLatestFiles', () => {
    spyOn(fixture.componentInstance, 'getLatestFiles');

    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    expect(fixture.componentInstance.getLatestFiles)
      .withContext('getLatestFiles should be called')
      .toHaveBeenCalled();
  });

  it('should change select value to trigger clearInformation', () => {
    spyOn(fixture.componentInstance, 'clearInformation');

    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    expect(fixture.componentInstance.clearInformation)
      .withContext('clearInformation should be called')
      .toHaveBeenCalled();
  });

  it('should display an image-container and a music container if there are any audios or images', () => {
    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    fixture.componentInstance.filesUpdateForm.patchValue({
      images: [downloadImageMockCopy],
      audios: [downloadMusicMockCopy],
    });

    fixture.detectChanges();

    const imageContainer = fixture.debugElement.query(
      By.css('.image-container')
    );

    const musicContainer = fixture.debugElement.query(
      By.css('.music-container')
    );

    expect(imageContainer)
      .withContext('imageContainer should be displayed')
      .toBeTruthy();
    expect(musicContainer)
      .withContext('musicContainer should be displayed')
      .toBeTruthy();
  });

  it('should display an image-container with one card', () => {
    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    fixture.componentInstance.filesUpdateForm.patchValue({
      images: [downloadImageMockCopy],
    });
    fixture.detectChanges();

    const imageContainer = fixture.debugElement.query(
      By.css('.image-container')
    );
    const imageCards = imageContainer.queryAll(By.css('.card'));

    expect(imageCards)
      .withContext('image cards should be displayed')
      .toBeTruthy();
  });

  it('should display an audio-container with one card', () => {
    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    fixture.componentInstance.filesUpdateForm.patchValue({
      audios: [downloadMusicMockCopy],
    });
    fixture.detectChanges();

    const audioContainer = fixture.debugElement.query(
      By.css('.music-container')
    );
    const audioCards = audioContainer.queryAll(By.css('.card'));

    expect(audioCards)
      .withContext('audio cards should be displayed')
      .toBeTruthy();
  });

  it('should call showDeleteDialog when deleting one card', () => {
    spyOn(fixture.componentInstance, 'showDeleteDialog');
    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    fixture.componentInstance.filesUpdateForm.patchValue({
      images: [downloadImageMockCopy],
    });
    fixture.detectChanges();

    const imageContainer = fixture.debugElement.query(
      By.css('.image-container')
    );
    const imageCards = imageContainer.queryAll(By.css('.card'));
    const buttons = imageCards[0].queryAll(By.css('button'));
    const deleteButton = buttons[1];

    deleteButton.nativeElement.click();

    expect(fixture.componentInstance.showDeleteDialog)
      .withContext('showDeleteDialog should be called')
      .toHaveBeenCalled();
  });

  it('should call onPhotosChange when uploading a photo', () => {
    spyOn(fixture.componentInstance, 'onPhotosChange');
    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    const uploadForm = fixture.debugElement.query(By.css('.upload-form'));
    const fileInput = uploadForm.query(By.css('#photoFiles'));

    fileInput.nativeElement.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.onPhotosChange)
      .withContext('onPhotosChange should be called')
      .toHaveBeenCalled();
  });

  it('should call onMusicChange when uploading a photo', () => {
    spyOn(fixture.componentInstance, 'onMusicChange');
    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    const uploadForm = fixture.debugElement.query(By.css('.upload-form'));
    const fileInput = uploadForm.query(By.css('#musicFiles'));

    fileInput.nativeElement.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.onMusicChange)
      .withContext('onMusicChange should be called')
      .toHaveBeenCalled();
  });

  it('should call saveFiles when saving an uploaded photo', () => {
    spyOn(fixture.componentInstance, 'saveFiles');
    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    uploadFile(new File([''], 'filename', { type: 'image/png' }));

    const uploadForm = fixture.debugElement.query(By.css('.upload-form'));
    const buttons = uploadForm.queryAll(By.css('button'));
    const saveButton = buttons[0];

    saveButton.nativeElement.click();

    expect(fixture.componentInstance.saveFiles)
      .withContext('saveFiles should be called')
      .toHaveBeenCalled();
  });
});
