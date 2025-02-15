import { InvitesImportModalComponent } from 'src/app/dashboard/events/event-details/invites-import-modal/invites-import-modal.component';

describe('Invites Import Modal Component (Isolated Test)', () => {
  let component: InvitesImportModalComponent;

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);
    component = new InvitesImportModalComponent(
      invitesSpy,
      toastrSpy,
      fileReaderSpy
    );
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
