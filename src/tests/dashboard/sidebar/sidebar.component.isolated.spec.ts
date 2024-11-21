import { SidebarComponent } from 'src/app/dashboard/sidebar/sidebar.component';

describe('Sidebar Component (Isolated Test)', () => {
  let component: SidebarComponent;

  beforeEach(() => {
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['']);
    component = new SidebarComponent(tokenStorageSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.isAdmin)
      .withContext('The isAdmin property should be false by default')
      .toBeFalse();
  });
});
