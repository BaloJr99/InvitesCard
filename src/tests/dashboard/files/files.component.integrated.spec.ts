import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CommonModalResponse, ImageUsage } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { EventsService } from 'src/app/core/services/events.service';
import { FilesService } from 'src/app/core/services/files.service';
import { FilesComponent } from 'src/app/dashboard/files/files.component';
import {
  downloadFileMock,
  dropdownEventsMock,
  messageResponseMock,
} from 'src/tests/mocks/mocks';

describe('Files Component (Integrated Test)', () => {
  let fixture: ComponentFixture<FilesComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let filesServiceSpy: jasmine.SpyObj<FilesService>;
  let commonModalServiceSpy: jasmine.SpyObj<CommonModalService>;

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

  beforeEach(waitForAsync(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getDropdownEvents',
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
  }));

  beforeEach(() => {
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMock));
    eventsServiceSpy.getDropdownEvents.and.returnValue(of(dropdownEventsMock));
    fixture = TestBed.createComponent(FilesComponent);
    fixture.detectChanges();
  });

  it('should call getDropdownEvents on init', () => {
    expect(eventsServiceSpy.getDropdownEvents)
      .withContext('getDropdownEvents should be called')
      .toHaveBeenCalled();
  });

  it('should call getFilesByEvent when event selected', () => {
    selectEvent(dropdownEventsMock[0].id);

    expect(filesServiceSpy.getFilesByEvent)
      .withContext('getFilesByEvent should be called')
      .toHaveBeenCalled();
  });

  it('should call updateImage when file is being updated and saved', () => {
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMock));
    filesServiceSpy.updateImage.and.returnValue(of(messageResponseMock));

    selectEvent(dropdownEventsMock[0].id);

    selectImageUsage(ImageUsage.Phone, 0);

    const saveButton = fixture.debugElement.query(By.css('#save-changes'));
    saveButton.nativeElement.click();

    expect(filesServiceSpy.updateImage)
      .withContext('updateImage should be called')
      .toHaveBeenCalled();
  });

  it('should call open and call delete file when file is being deleted and user confirms', () => {
    commonModalServiceSpy.open.and.returnValue(of(CommonModalResponse.Confirm));
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMock));
    filesServiceSpy.deleteFile.and.returnValue(of(messageResponseMock));

    selectEvent(dropdownEventsMock[0].id);

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
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMock));
    filesServiceSpy.deleteFile.and.returnValue(of(messageResponseMock));

    selectEvent(dropdownEventsMock[0].id);

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
