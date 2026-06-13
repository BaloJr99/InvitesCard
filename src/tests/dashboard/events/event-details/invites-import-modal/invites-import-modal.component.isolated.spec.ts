import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { FileReaderService } from 'src/app/core/services/file-reader.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { InvitesImportModalComponent } from 'src/app/dashboard/events/event-details/invites-import-modal/invites-import-modal.component';

describe('Invites Import Modal Component (Isolated Test)', () => {
  let component: InvitesImportModalComponent;
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
  const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
  const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InvitesImportModalComponent,
        { provide: ToastrService, useValue: toastrSpy },
        { provide: InvitesService, useValue: invitesSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
      ],
    });

    component = TestBed.createComponent(
      InvitesImportModalComponent,
    ).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render initial values', () => {
    expect(component.invites)
      .withContext('should have invites as an empty array')
      .toEqual([]);

    expect(component.errorInvites)
      .withContext('should have errorInvites as an empty array')
      .toEqual([]);

    expect(component.processingFile)
      .withContext('should have processingFile to be false')
      .toBeFalse();
  });
});
