import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { SidebarComponent } from 'src/app/dashboard/sidebar/sidebar.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { userMock } from 'src/tests/mocks/mocks';

const userMockCopy = deepCopy(userMock);

describe('Sidebar Component (Shallow Test)', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let tokenStorageServiceSpy: jasmine.SpyObj<TokenStorageService>;

  const listItemsText: { [key: string]: boolean } = {
    INICIO: false,
    EVENTOS: false,
    ARCHIVOS: false,
    USUARIOS: true,
    LOGS: true,
    TESTING: true,
    CONFIGURACIÓN: false,
  };

  beforeEach(async () => {
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', [
      'getTokenValues',
    ]);

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    tokenStorageServiceSpy = TestBed.inject(
      TokenStorageService
    ) as jasmine.SpyObj<TokenStorageService>;

    tokenStorageServiceSpy.getTokenValues.and.returnValue(userMockCopy);
    fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
  });

  it('should have 7 items in the sidebar if is admin', () => {
    const listGroup = fixture.debugElement.query(By.css('.list-group'));
    const listItems = listGroup.queryAll(By.css('a'));

    expect(listItems.length)
      .withContext('The sidebar should have 7 items')
      .toBe(7);

    listItems.forEach((item, index) => {
      expect(item.nativeElement.textContent.trim())
        .withContext(
          `Item ${index} should have the text ${listItemsText[index]}`
        )
        .toBe(Object.keys(listItemsText)[index]);
    });
  });

  it('should have 4 items in the sidebar if is not an admin', () => {
    fixture.componentInstance.isAdmin = false;
    fixture.detectChanges();

    const listGroup = fixture.debugElement.query(By.css('.list-group'));
    const listItems = listGroup.queryAll(By.css('a'));

    expect(listItems.length)
      .withContext('The sidebar should have 4 items')
      .toBe(4);

    const notAdminItems = Object.keys(listItemsText).filter(
      (key) => !listItemsText[key]
    );

    listItems.forEach((item, index) => {
      expect(item.nativeElement.textContent.trim())
        .withContext(
          `Item ${index} should have the text ${listItemsText[index]}`
        )
        .toBe(notAdminItems[index]);
    });
  });
});
