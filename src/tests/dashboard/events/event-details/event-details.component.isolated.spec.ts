import { EventType } from 'src/app/core/models/enum';
import { EventDetailsComponent } from 'src/app/dashboard/events/event-details/event-details.component';

describe('Event Details Component (Isolated Test)', () => {
  let component: EventDetailsComponent;

  beforeEach(() => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);
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
    expect(component.copyEventSettings)
      .withContext('should have copyEventSettings to be an object')
      .toEqual({
        typeOfEvent: EventType.None,
        settings: '',
      });

    expect(component.inviteAction)
      .withContext('should have inviteAction to be undefined')
      .toEqual({
        invite: Object({
          id: '',
          family: '',
          entriesNumber: 1,
          phoneNumber: '',
          inviteGroupId: '',
          kidsAllowed: true,
          eventId: '',
        }),
        isNew: false,
      });

    expect(component.invitesGrouped)
      .withContext('should have invitesGrouped to be an empty object')
      .toEqual({});

    expect(component.inviteGroups)
      .withContext('should have inviteGroups to be an empty array')
      .toEqual([]);
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

  it('should have a method to updateInvites', () => {
    expect(component.updateInvites)
      .withContext('should have a method to updateInvites')
      .toBeDefined();
  });
});
