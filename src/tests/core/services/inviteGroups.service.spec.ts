import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import {
  fullEventsMock,
  fullInvitesGroupsMock,
  messageResponseMock,
} from 'src/tests/mocks/mocks';

describe('Invite Groups Service', () => {
  let inviteGroupsService: InviteGroupsService;
  let inviteGroupsServiceSpy: jasmine.SpyObj<InviteGroupsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('InviteGroupsService', [
      'getAllInviteGroups',
      'createInviteGroup',
      'updateInviteGroup',
      'checkInviteGroup',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: InviteGroupsService, useValue: spy }],
    });

    inviteGroupsServiceSpy = TestBed.inject(
      InviteGroupsService
    ) as jasmine.SpyObj<InviteGroupsService>;
  });

  it('should be created', () => {
    inviteGroupsService = TestBed.inject(InviteGroupsService);
    expect(inviteGroupsService)
      .withContext('Expected Invite Groups Service to have been created')
      .toBeTruthy();
  });

  it('should call getAllInviteGroups', () => {
    inviteGroupsServiceSpy.getAllInviteGroups.and.returnValue(
      of([fullInvitesGroupsMock])
    );

    inviteGroupsServiceSpy
      .getAllInviteGroups(fullEventsMock.id)
      .subscribe((response) => {
        expect(response).toEqual([fullInvitesGroupsMock]);
        expect(response.length).toBe(1);
        expect(response[0].eventId).toEqual(fullEventsMock.id);
      });

    expect(inviteGroupsServiceSpy.getAllInviteGroups)
      .withContext('Expected getAllInviteGroups to have been called')
      .toHaveBeenCalledOnceWith(fullEventsMock.id);
  });

  it('should call createInviteGroup', () => {
    inviteGroupsServiceSpy.createInviteGroup.and.returnValue(
      of(messageResponseMock)
    );

    inviteGroupsServiceSpy
      .createInviteGroup(fullInvitesGroupsMock)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMock);
      });

    expect(inviteGroupsServiceSpy.createInviteGroup)
      .withContext('Expected createInviteGroup to have been called')
      .toHaveBeenCalledOnceWith(fullInvitesGroupsMock);
  });

  it('should call updateInviteGroup', () => {
    inviteGroupsServiceSpy.updateInviteGroup.and.returnValue(
      of(messageResponseMock)
    );

    inviteGroupsServiceSpy
      .updateInviteGroup(fullInvitesGroupsMock, fullInvitesGroupsMock.id)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMock);
      });

    expect(inviteGroupsServiceSpy.updateInviteGroup)
      .withContext('Expected updateInviteGroup to have been called')
      .toHaveBeenCalledOnceWith(
        fullInvitesGroupsMock,
        fullInvitesGroupsMock.id
      );
  });

  it('should call checkInviteGroup', () => {
    inviteGroupsServiceSpy.checkInviteGroup.and.returnValue(of(true));

    inviteGroupsServiceSpy
      .checkInviteGroup(
        fullInvitesGroupsMock.id,
        fullInvitesGroupsMock.inviteGroup
      )
      .subscribe((response) => {
        expect(response).toBeTrue();
      });

    expect(inviteGroupsServiceSpy.checkInviteGroup)
      .withContext('Expected checkInviteGroup to have been called')
      .toHaveBeenCalledOnceWith(
        fullInvitesGroupsMock.id,
        fullInvitesGroupsMock.inviteGroup
      );
  });
});
