import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { InvitesImportModalComponent } from 'src/app/dashboard/events/event-details/invites-import-modal/invites-import-modal.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  bulkInvitesMock,
  bulkMessageResponseMock,
  validFileMock,
} from 'src/tests/mocks/mocks';

const bulkInvitesMockCopy = deepCopy(bulkInvitesMock);
const bulkMessageResponseMockCopy = deepCopy(bulkMessageResponseMock);

describe('Invites Import Modal Component (Integrated Test)', () => {
  let fixture: ComponentFixture<InvitesImportModalComponent>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;
  let fileReaderServiceSpy: jasmine.SpyObj<FileReaderService>;

  const uploadFile = (file: File) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
    fileInput.nativeElement.files = dataTransfer.files;
    fileInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['bulkInvites']);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['read']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, InvitesImportModalComponent],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: InvitesService, useValue: invitesSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
      ],
    }).compileComponents();

    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;

    fileReaderServiceSpy = TestBed.inject(
      FileReaderService
    ) as jasmine.SpyObj<FileReaderService>;

    fixture = TestBed.createComponent(InvitesImportModalComponent);
    fixture.detectChanges();
  });

  it('Should change processingFile to true when onFileChange is called', () => {
    fileReaderServiceSpy.read.and.returnValue(of(''));
    uploadFile(validFileMock);

    const modal = fixture.debugElement.nativeElement;
    const buttons = modal.querySelectorAll('button');
    const processFileButton = buttons[3];
    processFileButton.click();

    expect(fixture.componentInstance.processingFile)
      .withContext('processingFile should be true')
      .toBeTrue();
  });

  it('should call fileReaderService read() method when user uploads a file', () => {
    fileReaderServiceSpy.read.and.returnValue(of(''));

    uploadFile(validFileMock);

    expect(fileReaderServiceSpy.read)
      .withContext('read method from FileReaderService should have been called')
      .toHaveBeenCalled();
  });

  it('should call invitesService bulkInvites() method when sendData() is called', () => {
    fixture.componentInstance.invites = [bulkInvitesMockCopy];
    invitesServiceSpy.bulkInvites.and.returnValue(
      of(bulkMessageResponseMockCopy)
    );

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[3];
    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(invitesServiceSpy.bulkInvites)
      .withContext(
        "bulkInvites method from InvitesService should've been called"
      )
      .toHaveBeenCalled();
  });
});
