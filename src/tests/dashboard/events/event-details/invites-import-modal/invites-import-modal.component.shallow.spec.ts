import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { InvitesImportModalComponent } from 'src/app/dashboard/events/event-details/invites-import-modal/invites-import-modal.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { bulkInvitesMock, fullInvitesGroupsMock } from 'src/tests/mocks/mocks';

const bulkInvitesMockCopy = deepCopy(bulkInvitesMock);
const fullInvitesGroupsMockCopy = deepCopy(fullInvitesGroupsMock);

describe('Invites Import Modal Component (Shallow Test)', () => {
  let fixture: ComponentFixture<InvitesImportModalComponent>;

  beforeEach(waitForAsync(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const invitesSpy = jasmine.createSpyObj('InviteGroupsService', ['']);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);

    TestBed.configureTestingModule({
      imports: [InvitesImportModalComponent],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: InvitesService, useValue: invitesSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitesImportModalComponent);
    fixture.detectChanges();
  });

  it('created a modal with input to upload a file, buttons (download template, close, process file) and hidden (table, progress-bar)', () => {
    const modal = fixture.debugElement.nativeElement;
    const fileInput = modal.querySelector('input[type="file"]');
    const buttons = modal.querySelectorAll('button');
    const downloadTemplateButton = buttons[1];
    const closeButton = buttons[2];
    const processFileButton = buttons[3];
    const table = modal.querySelector('table');
    const progressBar = modal.querySelector('progress-bar');

    expect(fileInput)
      .withContext("Input to upload a file shouldn't be null")
      .not.toBeNull();

    expect(downloadTemplateButton)
      .withContext("Button to download template shouldn't be null")
      .not.toBeNull();

    expect(closeButton)
      .withContext("Close button shouldn't be null")
      .not.toBeNull();

    expect(processFileButton)
      .withContext("Process file button shouldn't be null")
      .not.toBeNull();

    expect(table).withContext('Table should be hidden').toBeNull();

    expect(progressBar).withContext('Progress bar should be hidden').toBeNull();
  });

  it('Expect processFile button should be disabled if there are no processed files', () => {
    spyOn(fixture.componentInstance, 'sendData');

    const modal = fixture.debugElement.nativeElement;
    const buttons = modal.querySelectorAll('button');
    const processFileButton = buttons[3];

    expect(processFileButton.disabled)
      .withContext('Process file button should be disabled')
      .toBeTrue();
  });

  it('Expect processFile button should be enabled and should call send data if there are processed files', () => {
    spyOn(fixture.componentInstance, 'sendData');

    fixture.componentInstance.invites = [bulkInvitesMockCopy];
    fixture.detectChanges();

    const modal = fixture.debugElement.nativeElement;
    const buttons = modal.querySelectorAll('button');
    const processFileButton = buttons[3];

    processFileButton.click();

    expect(processFileButton.disabled)
      .withContext('Process file button should be enabled')
      .toBeFalse();

    expect(fixture.componentInstance.sendData)
      .withContext('sendData should be called')
      .toHaveBeenCalled();
  });

  it('Expect file input should call onFileChange when a file is selected', () => {
    spyOn(fixture.componentInstance, 'onFileChange');

    const modal = fixture.debugElement.nativeElement;
    const fileInput = modal.querySelector('input[type="file"]');

    fileInput.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.onFileChange)
      .withContext('onFileChange should be called')
      .toHaveBeenCalled();
  });

  it('Should call downloadTemplate when download template button is clicked', () => {
    spyOn(fixture.componentInstance, 'downloadTemplate');

    const modal = fixture.debugElement.nativeElement;
    const buttons = modal.querySelectorAll('button');
    const downloadTemplateButton = buttons[1];

    downloadTemplateButton.click();

    expect(fixture.componentInstance.downloadTemplate)
      .withContext('downloadTemplate should be called')
      .toHaveBeenCalled();
  });

  it('Should show progress bar if processingFile is true', () => {
    fixture.componentInstance.processingFile = true;
    fixture.detectChanges();

    const progressBar = fixture.debugElement.query(By.css('.progress-bar'));

    expect(progressBar)
      .withContext('Progress bar should be visible')
      .not.toBeNull();
  });

  it('Should show table when there are invites processed (Kids Allowed and New Invite Group)', () => {
    fixture.componentInstance.invites = [bulkInvitesMockCopy];
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));

    expect(table).withContext('Table should be visible').not.toBeNull();

    expect(table.nativeElement.rows.length)
      .withContext('Table should have 1 row')
      .toBe(1);

    expect(table.nativeElement.rows[0].cells.length)
      .withContext('Table should have 5 columns')
      .toBe(5);

    expect(table.nativeElement.rows[0].cells[0].textContent)
      .withContext('First column should have family')
      .toBe(bulkInvitesMockCopy.family);

    expect(table.nativeElement.rows[0].cells[1].textContent)
      .withContext('Second column should have entriesNumber')
      .toBe(bulkInvitesMockCopy.entriesNumber.toString());

    expect(table.nativeElement.rows[0].cells[2].textContent)
      .withContext('Third column should have phoneNumber')
      .toBe(bulkInvitesMockCopy.phoneNumber);

    expect(table.nativeElement.rows[0].cells[3].innerHTML)
      .withContext('Fourth column should have a circle check')
      .toContain('fa-circle-check');

    expect(table.nativeElement.rows[0].cells[4].innerHTML)
      .withContext('Fifth column should have the name of the group')
      .toContain('Test Group');

    expect(table.nativeElement.rows[0].cells[4].innerHTML)
      .withContext('Sixth column should have a star')
      .toContain('fa-star');
  });

  it('Should show table when there are invites processed (Kids Not Allowed and Preloaded Invite Group)', () => {
    fixture.componentRef.setInput('inviteGroupsValue', [
      fullInvitesGroupsMockCopy,
    ]);
    fixture.componentRef.setInput('eventIdValue', bulkInvitesMockCopy.eventId);
    fixture.componentRef.setInput('showModalValue', true);
    fixture.detectChanges();

    fixture.componentInstance.invites = [
      { ...bulkInvitesMockCopy, kidsAllowed: false, isNewInviteGroup: false },
    ];
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));

    expect(table).withContext('Table should be visible').not.toBeNull();

    expect(table.nativeElement.rows.length)
      .withContext('Table should have 1 row')
      .toBe(1);

    expect(table.nativeElement.rows[0].cells.length)
      .withContext('Table should have 5 columns')
      .toBe(5);

    expect(table.nativeElement.rows[0].cells[0].textContent)
      .withContext('First column should have family')
      .toBe(bulkInvitesMockCopy.family);

    expect(table.nativeElement.rows[0].cells[1].textContent)
      .withContext('Second column should have entriesNumber')
      .toBe(bulkInvitesMockCopy.entriesNumber.toString());

    expect(table.nativeElement.rows[0].cells[2].textContent)
      .withContext('Third column should have phoneNumber')
      .toBe(bulkInvitesMockCopy.phoneNumber);

    expect(table.nativeElement.rows[0].cells[3].innerHTML)
      .withContext('Fourth column should have a circle xmark')
      .toContain('fa-circle-xmark');

    expect(table.nativeElement.rows[0].cells[4].innerHTML)
      .withContext('Fifth column should have the name of the group')
      .toContain('Test Group');

    expect(table.nativeElement.rows[0].cells[4].innerHTML)
      .withContext("Sixth column shouldn't have a star")
      .not.toContain('fa-star');
  });
});
