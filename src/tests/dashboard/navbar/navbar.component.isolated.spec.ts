import { NavbarComponent } from 'src/app/dashboard/navbar/navbar.component';
import { notificationsMock } from 'src/tests/mocks/mocks';

describe('Navbar Component (Isolated Test)', () => {
  let component: NavbarComponent;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['']);
    const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', ['']);

    component = new NavbarComponent(
      routerSpy,
      invitesSpy,
      tokenStorageSpy,
      commonInvitesSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.email)
      .withContext('The email should be initialized to an empty string')
      .toBe('');
    expect(component.username)
      .withContext('The username should be initialized to an empty string')
      .toBe('');
    expect(component.profilePhoto)
      .withContext('The profile photo should be initialized to an empty string')
      .toBe('');
    expect(component.notifications)
      .withContext('The notifications should be initialized to an empty array')
      .toEqual([]);
    expect(component.numberOfNotifications)
      .withContext('The number of notifications should be initialized to 0')
      .toBe(0);
    expect(component.route)
      .withContext('The route should be initialized to an empty string')
      .toBe('');
    expect(component.isAdmin)
      .withContext('The isAdmin should be initialized to false')
      .toBeFalse();
  });

  it('should populate the notifications when the input is set', () => {
    component.notificationsValue = notificationsMock;

    expect(component.notifications)
      .withContext('The notifications should be set')
      .toEqual(notificationsMock);

    expect(component.numberOfNotifications)
      .withContext('The number of notifications should be set')
      .toBe(1);
  });
});
