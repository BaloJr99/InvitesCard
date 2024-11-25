import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { SidebarComponent } from 'src/app/dashboard/sidebar/sidebar.component';
import { userMock } from 'src/tests/mocks/mocks';

describe('Sidebar Component (Integrated Test)', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let tokenStorageServiceSpy: jasmine.SpyObj<TokenStorageService>;

  const availableRoutes: string[] = [
    '/dashboard/home',
    '/dashboard/events',
    '/dashboard/files',
    '/dashboard/users',
    '/dashboard/logs',
    '/dashboard/settings',
  ];

  beforeEach(waitForAsync(() => {
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', [
      'getTokenValues',
    ]);

    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [RouterLink],
      providers: [
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    tokenStorageServiceSpy = TestBed.inject(
      TokenStorageService
    ) as jasmine.SpyObj<TokenStorageService>;
  }));

  beforeEach(() => {
    tokenStorageServiceSpy.getTokenValues.and.returnValue(userMock);
    fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
  });

  it('can get RouterLinks from template', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    const routerLinks = linkDes.map((de) => de.injector.get(RouterLink));

    expect(routerLinks.length)
      .withContext('should have 6 router links')
      .toBe(6);

    expect(routerLinks.map((rl) => rl.href))
      .withContext('should have correct routes')
      .toEqual(availableRoutes);
  });
});