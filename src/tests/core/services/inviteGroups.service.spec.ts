import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  fullEventsMock,
  fullInvitesGroupsMock,
  messageResponseMock,
} from 'src/tests/mocks/mocks';

const fullEventsMockCopy = deepCopy(fullEventsMock);
const fullInvitesGroupsMockCopy = deepCopy(fullInvitesGroupsMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);

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
      of([fullInvitesGroupsMockCopy])
    );

    inviteGroupsServiceSpy
      .getAllInviteGroups(fullEventsMockCopy.id)
      .subscribe((response) => {
        expect(response).toEqual([fullInvitesGroupsMockCopy]);
        expect(response.length).toBe(1);
        expect(response[0].eventId).toEqual(fullEventsMockCopy.id);
      });

    expect(inviteGroupsServiceSpy.getAllInviteGroups)
      .withContext('Expected getAllInviteGroups to have been called')
      .toHaveBeenCalledOnceWith(fullEventsMockCopy.id);
  });

  it('should call createInviteGroup', () => {
    inviteGroupsServiceSpy.createInviteGroup.and.returnValue(
      of(messageResponseMockCopy)
    );

    inviteGroupsServiceSpy
      .createInviteGroup(fullInvitesGroupsMockCopy)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMockCopy);
      });

    expect(inviteGroupsServiceSpy.createInviteGroup)
      .withContext('Expected createInviteGroup to have been called')
      .toHaveBeenCalledOnceWith(fullInvitesGroupsMockCopy);
  });

  it('should call updateInviteGroup', () => {
    inviteGroupsServiceSpy.updateInviteGroup.and.returnValue(
      of(messageResponseMockCopy)
    );

    inviteGroupsServiceSpy
      .updateInviteGroup(fullInvitesGroupsMockCopy, fullInvitesGroupsMockCopy.id)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMockCopy);
      });

    expect(inviteGroupsServiceSpy.updateInviteGroup)
      .withContext('Expected updateInviteGroup to have been called')
      .toHaveBeenCalledOnceWith(
        fullInvitesGroupsMockCopy,
        fullInvitesGroupsMockCopy.id
      );
  });

  it('should call checkInviteGroup', () => {
    inviteGroupsServiceSpy.checkInviteGroup.and.returnValue(of(true));

    inviteGroupsServiceSpy
      .checkInviteGroup(
        fullInvitesGroupsMockCopy.id,
        fullInvitesGroupsMockCopy.inviteGroup
      )
      .subscribe((response) => {
        expect(response).toBeTrue();
      });

    expect(inviteGroupsServiceSpy.checkInviteGroup)
      .withContext('Expected checkInviteGroup to have been called')
      .toHaveBeenCalledOnceWith(
        fullInvitesGroupsMockCopy.id,
        fullInvitesGroupsMockCopy.inviteGroup
      );
  });
});
