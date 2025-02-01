import { DashboardComponent } from 'src/app/dashboard/dashboard.component';

describe('Dashboard Component (Isolated Test)', () => {
  let component: DashboardComponent;

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['']);
    const socketSpy = jasmine.createSpyObj('SocketService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', ['']);
    const router = jasmine.createSpyObj('Router', ['']);
    const localeId = 'en-US';

    component = new DashboardComponent(
      tokenSpy,
      socketSpy,
      loaderSpy,
      commonInvitesSpy,
      router,
      localeId
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.notifications)
      .withContext('notifications should be an empty array')
      .toEqual([]);

    expect(component.messagesGrouped)
      .withContext('messagesGrouped should be an empty array')
      .toEqual([]);

    expect(component.route)
      .withContext('route should be an empty string')
      .toEqual('');
  });
});
