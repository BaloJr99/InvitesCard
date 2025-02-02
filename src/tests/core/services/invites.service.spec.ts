import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InvitesService } from 'src/app/core/services/invites.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  bulkInvitesMock,
  bulkMessageResponseMock,
  confirmationInviteMock,
  dashboardInvitesMock,
  fullEventsMock,
  messageResponseMock,
  newInviteMock,
  sweetXvUserInviteMock,
  upsertInviteMock,
} from 'src/tests/mocks/mocks';

const bulkInvitesMockCopy = deepCopy(bulkInvitesMock);
const bulkMessageResponseMockCopy = deepCopy(bulkMessageResponseMock);
const confirmationInviteMockCopy = deepCopy(confirmationInviteMock);
const dashboardInvitesMockCopy = deepCopy(dashboardInvitesMock);
const fullEventsMockCopy = deepCopy(fullEventsMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);
const newInviteMockCopy = deepCopy(newInviteMock);
const sweetXvUserInviteMockCopy = deepCopy(sweetXvUserInviteMock);
const upsertInviteMockCopy = deepCopy(upsertInviteMock);

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
    invitesServiceSpy.getAllInvites.and.returnValue(of([dashboardInvitesMockCopy]));

    invitesServiceSpy.getAllInvites().subscribe((response) => {
      expect(response).toEqual([dashboardInvitesMockCopy]);
    });

    expect(invitesServiceSpy.getAllInvites)
      .withContext('Expected getAllInvites to have been called')
      .toHaveBeenCalledOnceWith();
  });

  it('should call getInvite', () => {
    invitesServiceSpy.getInvite.and.returnValue(of(sweetXvUserInviteMockCopy));

    invitesServiceSpy
      .getInvite(sweetXvUserInviteMockCopy.id)
      .subscribe((response) => {
        expect(response).toBe(sweetXvUserInviteMockCopy);
      });

    expect(invitesServiceSpy.getInvite)
      .withContext('Expected getInvite to have been called')
      .toHaveBeenCalledOnceWith(sweetXvUserInviteMockCopy.id);
  });

  it('should call createInvite', () => {
    invitesServiceSpy.createInvite.and.returnValue(of(messageResponseMockCopy));

    invitesServiceSpy.createInvite(upsertInviteMockCopy).subscribe((response) => {
      expect(response).toBe(messageResponseMockCopy);
    });

    expect(invitesServiceSpy.createInvite)
      .withContext('Expected createInvite to have been called')
      .toHaveBeenCalledOnceWith(upsertInviteMockCopy);
  });

  it('should call updateInvite', () => {
    invitesServiceSpy.updateInvite.and.returnValue(of(messageResponseMockCopy));

    invitesServiceSpy
      .updateInvite(upsertInviteMockCopy, upsertInviteMockCopy.id)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMockCopy);
      });

    expect(invitesServiceSpy.updateInvite)
      .withContext('Expected updateInvite to have been called')
      .toHaveBeenCalledOnceWith(upsertInviteMockCopy, upsertInviteMockCopy.id);
  });

  it('should call deleteInvite', () => {
    invitesServiceSpy.deleteInvite.and.returnValue(of(messageResponseMockCopy));

    invitesServiceSpy
      .deleteInvite(upsertInviteMockCopy.id)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMockCopy);
      });

    expect(invitesServiceSpy.deleteInvite)
      .withContext('Expected deleteInvite to have been called')
      .toHaveBeenCalledOnceWith(upsertInviteMockCopy.id);
  });

  it('should call sendConfirmation', () => {
    invitesServiceSpy.sendConfirmation.and.returnValue(of(messageResponseMockCopy));

    invitesServiceSpy
      .sendConfirmation(
        confirmationInviteMockCopy,
        confirmationInviteMockCopy.id,
        fullEventsMockCopy.typeOfEvent
      )
      .subscribe((response) => {
        expect(response).toBe(messageResponseMockCopy);
      });

    expect(invitesServiceSpy.sendConfirmation)
      .withContext('Expected sendConfirmation to have been called')
      .toHaveBeenCalledOnceWith(
        confirmationInviteMockCopy,
        confirmationInviteMockCopy.id,
        fullEventsMockCopy.typeOfEvent
      );
  });

  it('should call readMessage', () => {
    invitesServiceSpy.readMessage.and.returnValue(of(messageResponseMockCopy));

    invitesServiceSpy
      .readMessage(confirmationInviteMockCopy.id)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMockCopy);
      });

    expect(invitesServiceSpy.readMessage)
      .withContext('Expected readMessage to have been called')
      .toHaveBeenCalledOnceWith(confirmationInviteMockCopy.id);
  });

  it('should call bulkInvites', () => {
    invitesServiceSpy.bulkInvites.and.returnValue(of(bulkMessageResponseMockCopy));

    invitesServiceSpy.bulkInvites([bulkInvitesMockCopy]).subscribe((response) => {
      expect(response).toBe(bulkMessageResponseMockCopy);
    });

    expect(invitesServiceSpy.bulkInvites)
      .withContext('Expected bulkInvites to have been called')
      .toHaveBeenCalledOnceWith([bulkInvitesMockCopy]);
  });

  it('should call bulkDeleteInvites', () => {
    invitesServiceSpy.bulkDeleteInvites.and.returnValue(
      of(messageResponseMockCopy)
    );

    invitesServiceSpy
      .bulkDeleteInvites([newInviteMockCopy.id])
      .subscribe((response) => {
        expect(response).toBe(messageResponseMockCopy);
      });

    expect(invitesServiceSpy.bulkDeleteInvites)
      .withContext('Expected bulkDeleteInvites to have been called')
      .toHaveBeenCalledOnceWith([newInviteMockCopy.id]);
  });

  it('should call getInviteEventType', () => {
    invitesServiceSpy.getInviteEventType.and.returnValue(
      of(fullEventsMockCopy.typeOfEvent)
    );

    invitesServiceSpy
      .getInviteEventType(newInviteMockCopy.eventId)
      .subscribe((response) => {
        expect(response).toBe(fullEventsMockCopy.typeOfEvent);
      });

    expect(invitesServiceSpy.getInviteEventType)
      .withContext('Expected getInviteEventType to have been called')
      .toHaveBeenCalledOnceWith(newInviteMockCopy.eventId);
  });
});
