import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { NavbarComponent } from 'src/app/dashboard/navbar/navbar.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  messageResponseMock,
  notificationsMock,
  userMock,
} from 'src/tests/mocks/mocks';

const messageResponseMockCopy = deepCopy(messageResponseMock);
const notificationsMockCopy = deepCopy(notificationsMock);
const userMockCopy = deepCopy(userMock);

describe('Navbar Component (Integrated Test)', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;
  let tokenStorageServiceSpy: jasmine.SpyObj<TokenStorageService>;
  let commonInvitesServiceSpy: jasmine.SpyObj<CommonInvitesService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['readMessage']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', [
      'signOut',
      'getTokenValues',
    ]);

    const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', [
      'updateNotifications',
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.events = of(new NavigationStart(0, 'http://localhost:4200'));

    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        { provide: CommonInvitesService, useValue: commonInvitesSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;

    tokenStorageServiceSpy = TestBed.inject(
      TokenStorageService
    ) as jasmine.SpyObj<TokenStorageService>;

    commonInvitesServiceSpy = TestBed.inject(
      CommonInvitesService
    ) as jasmine.SpyObj<CommonInvitesService>;

    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    invitesServiceSpy.readMessage.and.returnValue(of(messageResponseMockCopy));
    tokenStorageServiceSpy.getTokenValues.and.returnValue(userMockCopy);

    fixture = TestBed.createComponent(NavbarComponent);
    fixture.componentRef.setInput('notificationsValue', notificationsMockCopy);
    fixture.detectChanges();
  });

  it('should call toggleMenu when the account button is clicked', () => {
    spyOn(fixture.componentInstance, 'toggleMenu');
    const navbarWithSearchAndForm = fixture.nativeElement.querySelector(
      '.navbarWithSearchAndForm'
    );
    const accountButton = navbarWithSearchAndForm.querySelector('.account');
    accountButton.click();

    expect(fixture.componentInstance.toggleMenu)
      .withContext(
        'You should call toggleMenu when the account button is clicked'
      )
      .toHaveBeenCalled();
  });

  it('should call logout when the logout button is clicked', () => {
    spyOn(fixture.componentInstance, 'logout');
    const baseMenu = fixture.debugElement.query(By.css('.base-menu.menu'));
    const menuItems = baseMenu.queryAll(By.css('ul li'));
    const logoutButton = menuItems[1].query(By.css('button'));
    logoutButton.nativeElement.click();

    expect(fixture.componentInstance.logout)
      .withContext('You should call logout when the logout button is clicked')
      .toHaveBeenCalled();

    expect();
  });

  it('should call signOut, and navigate to /auth/login when logout is called', () => {
    const baseMenu = fixture.debugElement.query(By.css('.base-menu.menu'));
    const menuItems = baseMenu.queryAll(By.css('ul li'));
    const logoutButton = menuItems[1].query(By.css('button'));

    logoutButton.nativeElement.click();
    fixture.detectChanges();

    expect(tokenStorageServiceSpy.signOut)
      .withContext('You should call signOut when logout is called')
      .toHaveBeenCalled();

    expect(router.navigate)
      .withContext('You should navigate to /auth/login when logout is called')
      .toHaveBeenCalledWith(['/auth/login']);
  });

  it('should maskAsRead when the notification is clicked', () => {
    spyOn(fixture.componentInstance, 'maskAsRead');

    fixture.componentRef.setInput('notificationsValue', notificationsMockCopy);
    fixture.detectChanges();

    const notificationMessages = fixture.debugElement.query(
      By.css('.base-menu.notificationMessages')
    );

    const notificationItems = notificationMessages.queryAll(By.css('button'));
    notificationItems[0].nativeElement.click();

    expect(fixture.componentInstance.maskAsRead)
      .withContext(
        'You should call maskAsRead when the notification is clicked'
      )
      .toHaveBeenCalled();
  });

  it('should call readMessage and updateNotifications when the notification is clicked', () => {
    fixture.componentRef.setInput('notificationsValue', notificationsMockCopy);
    fixture.detectChanges();

    // expect(fixture.componentInstance.notifications[0].isMessageRead)
    //   .withContext('The notification should be unread before it is clicked')
    //   .toBeFalse();

    // expect(fixture.componentInstance.numberOfNotifications)
    //   .withContext(
    //     'The number of notifications should be the same as the number of unread notifications before the notification is clicked'
    //   )
    //   .toBe(1);

    const notificationMessages = fixture.debugElement.query(
      By.css('.base-menu.notificationMessages')
    );

    const notificationItems = notificationMessages.queryAll(By.css('button'));
    notificationItems[0].nativeElement.click();

    expect(invitesServiceSpy.readMessage)
      .withContext(
        'You should call readMessage when the notification is clicked'
      )
      .toHaveBeenCalled();

    expect(commonInvitesServiceSpy.updateNotifications)
      .withContext(
        'You should call updateNotifications when the notification is clicked'
      )
      .toHaveBeenCalled();

    // expect(fixture.componentInstance.notifications[0].isMessageRead)
    //   .withContext(
    //     'You should update the notification to be read when the notification is clicked'
    //   )
    //   .toBeTrue();

    // expect(fixture.componentInstance.numberOfNotifications)
    //   .withContext(
    //     'You should update the number of notifications when the notification is clicked'
    //   )
    //   .toBe(0);
  });
});
