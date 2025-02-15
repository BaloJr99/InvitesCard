import { NavbarComponent } from 'src/app/dashboard/navbar/navbar.component';

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
});
