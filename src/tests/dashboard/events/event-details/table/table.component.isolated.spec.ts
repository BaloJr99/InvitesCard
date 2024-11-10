import { Subject } from 'rxjs';
import { EventType } from 'src/app/core/models/enum';
import { TableComponent } from 'src/app/dashboard/events/event-details/table/table.component';

describe('Table Component (Isolated Test)', () => {
  let component: TableComponent;

  beforeEach(() => {
    const inviteSpy = jasmine.createSpyObj('InviteService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['']);

    component = new TableComponent(
      inviteSpy,
      toastrSpy,
      loaderSpy,
      commonModalSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render initial values', () => {
    expect(component.isDeadlineMet)
      .withContext('should have isDeadlineMet as false')
      .toBeFalse();

    expect(component.eventInformation)
      .withContext('should have eventInformation to be an object')
      .toEqual({
        typeOfEvent: EventType.None,
        settings: '',
      });

    expect(component.originalInvites)
      .withContext('should have originalInvites to be an object')
      .toEqual({ key: '', value: [] });

    expect(component.inviteGroup)
      .withContext('should have inviteGroup to be an object')
      .toEqual({ key: '', value: [] });

    expect(component.dtOptions)
      .withContext('should have dtOptions to be an object')
      .toEqual({});

    expect(component.dtTrigger)
      .withContext('should have dtTrigger to be an instance of Subject')
      .toBeInstanceOf(Subject);
  });
});
