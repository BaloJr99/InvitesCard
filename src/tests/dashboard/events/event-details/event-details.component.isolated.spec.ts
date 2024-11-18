import { EventType } from 'src/app/core/models/enum';
import { EventDetailsComponent } from 'src/app/dashboard/events/event-details/event-details.component';

describe('Event Details Component (Isolated Test)', () => {
  let component: EventDetailsComponent;

  beforeEach(() => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const inviteGroupsSpy = jasmine.createSpyObj('InviteGroupsService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const eventsSpy = jasmine.createSpyObj('EventsService', ['']);
    const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', ['']);
    const socketSpy = jasmine.createSpyObj('SocketService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['']);
    const localeId = 'en-US';

    component = new EventDetailsComponent(
      activatedRouteSpy,
      loaderSpy,
      inviteGroupsSpy,
      invitesSpy,
      eventsSpy,
      commonInvitesSpy,
      socketSpy,
      toastrSpy,
      commonModalSpy,
      localeId
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render initial values', () => {
    expect(component.statistics)
      .withContext('should have statistics to be an object')
      .toEqual([]);

    expect(component.eventId)
      .withContext('should have eventId to be an empty array')
      .toBe('');

    expect(component.copyEventInformation)
      .withContext('should have copyEventInformation to be an object')
      .toEqual({
        typeOfEvent: EventType.None,
        settings: '',
      });

    expect(component.inviteAction)
      .withContext('should have inviteAction to be undefined')
      .toBeUndefined();

    expect(component.invitesGrouped)
      .withContext('should have invitesGrouped to be an empty object')
      .toEqual({});

    expect(component.originalInvites)
      .withContext('should have invites to be an empty array')
      .toEqual([]);

    expect(component.filteredInvites)
      .withContext('should have filteredInvites to be an empty array')
      .toEqual([]);

    expect(component.inviteGroups)
      .withContext('should have inviteGroups to be an empty array')
      .toEqual([]);

    expect(component.filterByFamily)
      .withContext('should have filterByFamily to be an empty string')
      .toBe('');

    expect(component.filterByInviteViewed)
      .withContext('should have filterByInviteViewed to be undefined')
      .toBeUndefined();

    expect(component.filterByNeedsAccomodation)
      .withContext('should have filterByNeedsAccomodation to be undefined')
      .toBeUndefined();

    expect(component.isDeadlineMet)
      .withContext('should have isDeadlineMet to be false')
      .toBeFalse();
  });

  it('should have a method to filter invites', () => {
    expect(component.filterInvites)
      .withContext('should have a method to filter invites')
      .toBeDefined();
  });

  it('should have a method to updateBulkResults', () => {
    expect(component.updateBulkResults)
      .withContext('should have a method to updateBulkResults')
      .toBeDefined();
  });

  it('should have a method to updateInviteGroups', () => {
    expect(component.updateInviteGroups)
      .withContext('should have a method to updateInviteGroups')
      .toBeDefined();
  });

  it('should have a method to groupEntries', () => {
    expect(component.groupEntries)
      .withContext('should have a method to groupEntries')
      .toBeDefined();
  });

  it('should have a method to fillInviteAction', () => {
    expect(component.fillInviteAction)
      .withContext('should have a method to fillInviteAction')
      .toBeDefined();
  });

  it('should have a method to removeInvites', () => {
    expect(component.removeInvites)
      .withContext('should have a method to removeInvites')
      .toBeDefined();
  });

  it('should have a method to toggleMessages', () => {
    expect(component.toggleMessages)
      .withContext('should have a method to toggleMessages')
      .toBeDefined();
  });

  it('should have a method to filterEntries', () => {
    expect(component.filterEntries)
      .withContext('should have a method to filterEntries')
      .toBeDefined();
  });

  it('should have a method to updateInvites', () => {
    expect(component.updateInvites)
      .withContext('should have a method to updateInvites')
      .toBeDefined();
  });
});
