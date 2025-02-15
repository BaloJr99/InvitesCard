import { DashboardComponent } from 'src/app/dashboard/dashboard.component';

describe('Dashboard Component (Isolated Test)', () => {
  let component: DashboardComponent;

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['']);
    const socketSpy = jasmine.createSpyObj('SocketService', ['']);
    const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', ['']);
    const router = jasmine.createSpyObj('Router', ['']);

    component = new DashboardComponent(
      tokenSpy,
      socketSpy,
      commonInvitesSpy,
      router
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
