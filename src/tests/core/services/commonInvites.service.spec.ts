import { fakeAsync, TestBed } from '@angular/core/testing';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import { messagesMock, notificationsMock } from 'src/tests/mocks/mocks';

const messagesMockCopy = deepCopy(messagesMock)
const notificationsMockCopy = deepCopy(notificationsMock)

describe('CommonInvitesService', () => {
  let commonInvitesService: CommonInvitesService;
  let commonInvitesServiceSpy: jasmine.SpyObj<CommonInvitesService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CommonInvitesService', [
      'updateNotifications',
      'clearNotifications',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: CommonInvitesService, useValue: spy }],
    });

    commonInvitesServiceSpy = TestBed.inject(
      CommonInvitesService
    ) as jasmine.SpyObj<CommonInvitesService>;
  });

  it('should be created', () => {
    commonInvitesService = TestBed.inject(CommonInvitesService);
    expect(commonInvitesService)
      .withContext('Expected Common Invites Service to have been created')
      .toBeTruthy();
  });

  it('should call updateNotifications', fakeAsync(() => {
    commonInvitesServiceSpy.updateNotifications(
      notificationsMockCopy,
      messagesMockCopy
    );

    expect(commonInvitesServiceSpy.updateNotifications)
      .withContext('Expected updateNotifications to have been called')
      .toHaveBeenCalledOnceWith(notificationsMockCopy, messagesMockCopy);
  }));

  it('should call clearNotifications', () => {
    commonInvitesServiceSpy.clearNotifications();

    expect(commonInvitesServiceSpy.clearNotifications)
      .withContext('Expected clearNotifications to have been called')
      .toHaveBeenCalled();
    expect(commonInvitesServiceSpy.clearNotifications)
      .withContext('Expected clearNotifications to have been called only once')
      .toHaveBeenCalledTimes(1);
  });
});
