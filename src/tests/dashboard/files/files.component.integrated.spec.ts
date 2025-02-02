import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CommonModalResponse, ImageUsage } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { EventsService } from 'src/app/core/services/events.service';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { FilesService } from 'src/app/core/services/files.service';
import { FilesComponent } from 'src/app/dashboard/files/files.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  downloadFileMock,
  dropdownEventsMock,
  messageResponseMock,
} from 'src/tests/mocks/mocks';

const downloadFileMockCopy = deepCopy(downloadFileMock);
const dropdownEventsMockCopy = deepCopy(dropdownEventsMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);

describe('Files Component (Integrated Test)', () => {
  let fixture: ComponentFixture<FilesComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let filesServiceSpy: jasmine.SpyObj<FilesService>;
  let commonModalServiceSpy: jasmine.SpyObj<CommonModalService>;
  let fileReaderServiceSpy: jasmine.SpyObj<FileReaderService>;

  const selectEvent = (eventId: string) => {
    const eventSelect = fixture.debugElement.query(By.css('#event-select'));

    eventSelect.nativeElement.value = eventId;
    eventSelect.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
  };

  const selectImageUsage = (imageUsage: ImageUsage, cardIndex: number) => {
    const imageContainer = fixture.debugElement.query(
      By.css('.image-container')
    );

    const imageCards = imageContainer.queryAll(By.css('.card'));
    const imageUsageSelect = imageCards[cardIndex].query(By.css('select'));

    imageUsageSelect.nativeElement.value = imageUsage;
    imageUsageSelect.nativeElement.dispatchEvent(new Event('change'));

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
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', [
      'getBase64',
    ]);
    const filesSpy = jasmine.createSpyObj('FilesService', [
      'getFilesByEvent',
      'updateImage',
      'deleteFile',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['open']);

    TestBed.configureTestingModule({
      declarations: [FilesComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: EventsService, useValue: eventsSpy },
        { provide: FilesService, useValue: filesSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: CommonModalService, useValue: commonModalSpy },
      ],
    });

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;
    filesServiceSpy = TestBed.inject(
      FilesService
    ) as jasmine.SpyObj<FilesService>;
    commonModalServiceSpy = TestBed.inject(
      CommonModalService
    ) as jasmine.SpyObj<CommonModalService>;
    fileReaderServiceSpy = TestBed.inject(
      FileReaderService
    ) as jasmine.SpyObj<FileReaderService>;
  }));

  beforeEach(() => {
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMockCopy));
    eventsServiceSpy.getDropdownEvents.and.returnValue(of(dropdownEventsMockCopy));
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();
  });

  it('should call getDropdownEvents on init', () => {
    expect(eventsServiceSpy.getDropdownEvents)
      .withContext('getDropdownEvents should be called')
      .toHaveBeenCalled();
  });

  it('should call getFilesByEvent when event selected', () => {
    selectEvent(dropdownEventsMockCopy[0].id);

    expect(filesServiceSpy.getFilesByEvent)
      .withContext('getFilesByEvent should be called')
      .toHaveBeenCalled();
  });

  it('should call getBase64 when saving an uploaded photo', () => {
    fileReaderServiceSpy.getBase64.and.returnValue(of('image'));
    fixture.componentInstance.events = dropdownEventsMockCopy;
    fixture.detectChanges();

    selectEvent(dropdownEventsMockCopy[0].id);

    uploadFile(new File([''], 'filename', { type: 'image/png' }));

    const uploadForm = fixture.debugElement.query(By.css('.upload-form'));
    const buttons = uploadForm.queryAll(By.css('button'));
    const saveButton = buttons[0];

    saveButton.nativeElement.click();

    expect(fileReaderServiceSpy.getBase64)
      .withContext('getBase64 should be called')
      .toHaveBeenCalled();
  });

  it('should call updateImage when file is being updated and saved', () => {
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMockCopy));
    filesServiceSpy.updateImage.and.returnValue(of(messageResponseMockCopy));

    selectEvent(dropdownEventsMockCopy[0].id);

    selectImageUsage(ImageUsage.Phone, 0);

    const saveButton = fixture.debugElement.query(By.css('#save-changes'));
    saveButton.nativeElement.click();

    expect(filesServiceSpy.updateImage)
      .withContext('updateImage should be called')
      .toHaveBeenCalled();
  });

  it('should call open and call delete file when file is being deleted and user confirms', () => {
    commonModalServiceSpy.open.and.returnValue(of(CommonModalResponse.Confirm));
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMockCopy));
    filesServiceSpy.deleteFile.and.returnValue(of(messageResponseMockCopy));

    selectEvent(dropdownEventsMockCopy[0].id);

    const imageContainer = fixture.debugElement.query(
      By.css('.image-container')
    );
    const imageCards = imageContainer.queryAll(By.css('.card'));
    const buttons = imageCards[0].queryAll(By.css('button'));
    const deleteButton = buttons[1];

    deleteButton.nativeElement.click();

    expect(commonModalServiceSpy.open)
      .withContext('open should be called')
      .toHaveBeenCalled();

    expect(filesServiceSpy.deleteFile)
      .withContext('deleteFile should be called')
      .toHaveBeenCalled();
  });

  it("should call open but shouldn't call delete file when file is being deleted and user cancel", () => {
    commonModalServiceSpy.open.and.returnValue(of(CommonModalResponse.Cancel));
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMockCopy));
    filesServiceSpy.deleteFile.and.returnValue(of(messageResponseMockCopy));

    selectEvent(dropdownEventsMockCopy[0].id);

    const imageContainer = fixture.debugElement.query(
      By.css('.image-container')
    );
    const imageCards = imageContainer.queryAll(By.css('.card'));
    const buttons = imageCards[0].queryAll(By.css('button'));
    const deleteButton = buttons[1];

    deleteButton.nativeElement.click();

    expect(commonModalServiceSpy.open)
      .withContext('open should be called')
      .toHaveBeenCalled();

    expect(filesServiceSpy.deleteFile)
      .withContext("deleteFile shouldn't be called")
      .not.toHaveBeenCalled();
  });
});
