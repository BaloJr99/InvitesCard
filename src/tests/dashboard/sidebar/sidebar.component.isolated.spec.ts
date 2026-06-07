import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { SidebarComponent } from 'src/app/dashboard/sidebar/sidebar.component';

describe('Sidebar Component (Isolated Test)', () => {
  let component: SidebarComponent;
  const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ]
    });

    component = TestBed.createComponent(SidebarComponent).componentInstance;
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
