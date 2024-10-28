import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InvitesService } from 'src/app/core/services/invites.service';
import {
  bulkInvitesMock,
  bulkMessageResponseMock,
  confirmationInviteMock,
  dashboardInvitesMock,
  fullEventsMock,
  fullInviteMock,
  messageResponseMock,
  sweetXvUserInviteMock,
  upsertInviteMock,
} from 'src/tests/mocks/mocks';

describe('Invites Service', () => {
  let invitesService: InvitesService;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('InvitesService', [
      'getAllInvites',
      'getInvite',
      'createInvite',
      'updateInvite',
      'deleteInvite',
      'sendConfirmation',
      'readMessage',
      'bulkInvites',
      'bulkDeleteInvites',
      'getInviteEventType',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: InvitesService, useValue: spy }],
    });

    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;
  });

  it('should be created', () => {
    invitesService = TestBed.inject(InvitesService);
    expect(invitesService)
      .withContext('Expected Invites Service to have been created')
      .toBeTruthy();
  });

  it('should call getAllInvites', () => {
    invitesServiceSpy.getAllInvites.and.returnValue(of([dashboardInvitesMock]));

    invitesServiceSpy.getAllInvites().subscribe((response) => {
      expect(response).toEqual([dashboardInvitesMock]);
    });

    expect(invitesServiceSpy.getAllInvites)
      .withContext('Expected getAllInvites to have been called')
      .toHaveBeenCalledOnceWith();
  });

  it('should call getInvite', () => {
    invitesServiceSpy.getInvite.and.returnValue(of(sweetXvUserInviteMock));

    invitesServiceSpy
      .getInvite(sweetXvUserInviteMock.id)
      .subscribe((response) => {
        expect(response).toBe(sweetXvUserInviteMock);
      });

    expect(invitesServiceSpy.getInvite)
      .withContext('Expected getInvite to have been called')
      .toHaveBeenCalledOnceWith(sweetXvUserInviteMock.id);
  });

  it('should call createInvite', () => {
    invitesServiceSpy.createInvite.and.returnValue(of(messageResponseMock));

    invitesServiceSpy.createInvite(upsertInviteMock).subscribe((response) => {
      expect(response).toBe(messageResponseMock);
    });

    expect(invitesServiceSpy.createInvite)
      .withContext('Expected createInvite to have been called')
      .toHaveBeenCalledOnceWith(upsertInviteMock);
  });

  it('should call updateInvite', () => {
    invitesServiceSpy.updateInvite.and.returnValue(of(messageResponseMock));

    invitesServiceSpy
      .updateInvite(upsertInviteMock, upsertInviteMock.id)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMock);
      });

    expect(invitesServiceSpy.updateInvite)
      .withContext('Expected updateInvite to have been called')
      .toHaveBeenCalledOnceWith(upsertInviteMock, upsertInviteMock.id);
  });

  it('should call deleteInvite', () => {
    invitesServiceSpy.deleteInvite.and.returnValue(of(messageResponseMock));

    invitesServiceSpy
      .deleteInvite(upsertInviteMock.id)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMock);
      });

    expect(invitesServiceSpy.deleteInvite)
      .withContext('Expected deleteInvite to have been called')
      .toHaveBeenCalledOnceWith(upsertInviteMock.id);
  });

  it('should call sendConfirmation', () => {
    invitesServiceSpy.sendConfirmation.and.returnValue(of(messageResponseMock));

    invitesServiceSpy
      .sendConfirmation(
        confirmationInviteMock,
        fullInviteMock.id,
        fullEventsMock.typeOfEvent
      )
      .subscribe((response) => {
        expect(response).toBe(messageResponseMock);
      });

    expect(invitesServiceSpy.sendConfirmation)
      .withContext('Expected sendConfirmation to have been called')
      .toHaveBeenCalledOnceWith(
        confirmationInviteMock,
        fullInviteMock.id,
        fullEventsMock.typeOfEvent
      );
  });

  it('should call readMessage', () => {
    invitesServiceSpy.readMessage.and.returnValue(of(messageResponseMock));

    invitesServiceSpy.readMessage(fullInviteMock.id).subscribe((response) => {
      expect(response).toBe(messageResponseMock);
    });

    expect(invitesServiceSpy.readMessage)
      .withContext('Expected readMessage to have been called')
      .toHaveBeenCalledOnceWith(fullInviteMock.id);
  });

  it('should call bulkInvites', () => {
    invitesServiceSpy.bulkInvites.and.returnValue(of(bulkMessageResponseMock));

    invitesServiceSpy.bulkInvites([bulkInvitesMock]).subscribe((response) => {
      expect(response).toBe(bulkMessageResponseMock);
    });

    expect(invitesServiceSpy.bulkInvites)
      .withContext('Expected bulkInvites to have been called')
      .toHaveBeenCalledOnceWith([bulkInvitesMock]);
  });

  it('should call bulkDeleteInvites', () => {
    invitesServiceSpy.bulkDeleteInvites.and.returnValue(
      of(messageResponseMock)
    );

    invitesServiceSpy
      .bulkDeleteInvites([fullInviteMock.id])
      .subscribe((response) => {
        expect(response).toBe(messageResponseMock);
      });

    expect(invitesServiceSpy.bulkDeleteInvites)
      .withContext('Expected bulkDeleteInvites to have been called')
      .toHaveBeenCalledOnceWith([fullInviteMock.id]);
  });

  it('should call getInviteEventType', () => {
    invitesServiceSpy.getInviteEventType.and.returnValue(
      of(fullEventsMock.typeOfEvent)
    );

    invitesServiceSpy
      .getInviteEventType(fullInviteMock.eventId)
      .subscribe((response) => {
        expect(response).toBe(fullEventsMock.typeOfEvent);
      });

    expect(invitesServiceSpy.getInviteEventType)
      .withContext('Expected getInviteEventType to have been called')
      .toHaveBeenCalledOnceWith(fullInviteMock.eventId);
  });
});
