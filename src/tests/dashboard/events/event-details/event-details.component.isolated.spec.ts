import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventType } from 'src/app/core/models/enum';
import { CommonInvitesService } from 'src/app/core/services/common-invites.service';
import { CommonModalService } from 'src/app/core/services/common-modal.service';
import { EventsService } from 'src/app/core/services/events.service';
import { InviteGroupsService } from 'src/app/core/services/invite-groups.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { EventDetailsComponent } from 'src/app/dashboard/events/event-details/event-details.component';

describe('Event Details Component (Isolated Test)', () => {
  let component: EventDetailsComponent;
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);
  const inviteGroupsSpy = jasmine.createSpyObj('InviteGroupsService', ['']);
  const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
  const eventsSpy = jasmine.createSpyObj('EventsService', ['']);
  const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', ['']);
  const socketSpy = jasmine.createSpyObj('SocketService', ['']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
  const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: InviteGroupsService, useValue: inviteGroupsSpy },
        { provide: InvitesService, useValue: invitesSpy },
        { provide: EventsService, useValue: eventsSpy },
        { provide: CommonInvitesService, useValue: commonInvitesSpy },
        { provide: SocketService, useValue: socketSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: CommonModalService, useValue: commonModalSpy },
        { provide: LOCALE_ID, useValue: 'en-US' },
      ],
    });

    component = TestBed.createComponent(
      EventDetailsComponent,
    ).componentInstance;
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
