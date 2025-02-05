import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { NavbarComponent } from 'src/app/dashboard/navbar/navbar.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { notificationsMock, userMock } from 'src/tests/mocks/mocks';

const notificationsMockCopy = deepCopy(notificationsMock);
const userMockCopy = deepCopy(userMock);

describe('Navbar Component (Shallow Test)', () => {
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(waitForAsync(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', {
      getTokenValues: userMockCopy,
    });

    const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', ['']);

    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        { provide: CommonInvitesService, useValue: commonInvitesSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
  });

  it('should create a navbar-brand with DASHBOARD text inside the header', () => {
    const navbarBrand = fixture.nativeElement.querySelector('.navbar-brand');
    expect(navbarBrand).toBeTruthy();

    const navbarBrandText = navbarBrand.textContent;
    expect(navbarBrandText)
      .withContext('You should have a text inside the navbar-brand tag')
      .toContain('DASHBOARD');
  });

  it('should have a navbarWithSearchAndForm, with the account button and toggler menu', () => {
    const navbarWithSearchAndForm = fixture.nativeElement.querySelector(
      '.navbarWithSearchAndForm'
    );
    expect(navbarWithSearchAndForm)
      .withContext('You should have a navbarWithSearchAndForm class')
      .toBeTruthy();

    const accountButton = navbarWithSearchAndForm.querySelector('.account');
    expect(accountButton)
      .withContext('You should have an account button')
      .toBeTruthy();

    const togglerMenu =
      navbarWithSearchAndForm.querySelector('.navbar-toggler');

    expect(togglerMenu)
      .withContext('You should have a toggler menu')
      .toBeTruthy();
  });

  it('should have a base-menu menu with username and email, 3 items in the menu', () => {
    const baseMenu = fixture.debugElement.query(By.css('.base-menu.menu'));
    expect(baseMenu)
      .withContext('You should have a base-menu class')
      .toBeTruthy();

    const userHeading = baseMenu.query(By.css('p'));

    expect(userHeading)
      .withContext('You should have a p tag inside the base-menu')
      .toBeTruthy();

    expect(userHeading.nativeElement.textContent)
      .withContext('You should have the username inside the p tag')
      .toContain(userMockCopy.username);

    expect(userHeading.nativeElement.textContent)
      .withContext('You should have the email inside the p tag')
      .toContain(userMockCopy.email);

    const menuItems = baseMenu.queryAll(By.css('ul li'));

    expect(menuItems.length)
      .withContext('You should have 2 items inside the menu')
      .toBe(2);

    const textToMatch = ['Mi perfil', 'Cerrar sesión'];
    menuItems.map(
      (item, index) => item.nativeElement.textContent === textToMatch[index]
    );
  });

  it('should have a base-menu notificationMessages with 1 notification in the menu', () => {
    fixture.componentRef.setInput('notificationsValue', notificationsMockCopy);
    fixture.detectChanges();

    const notificationMessages = fixture.debugElement.query(
      By.css('.base-menu.notificationMessages')
    );

    expect(notificationMessages)
      .withContext('You should have a notificationMessages class')
      .toBeTruthy();

    const notificationItems = notificationMessages.queryAll(By.css('button'));

    expect(notificationItems.length)
      .withContext('You should have 1 notification inside the menu')
      .toBe(1);

    const now = new Date();
    const dateOfNotification = new Date(
      notificationsMockCopy[0].dateOfConfirmation
    );

    const diff = now.getTime() - dateOfNotification.getTime();

    // Cálculos para sacar lo que resta hasta ese tiempo objetivo / final
    const years = now.getFullYear() - dateOfNotification.getFullYear();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    const secs = Math.floor(diff / 1000);

    // La diferencia que se asignará para mostrarlo en la pantalla
    const time = {
      years,
      days,
      hours: hours - days * 24,
      minutes: mins - hours * 60,
      seconds: secs - mins * 60,
    };

    let timeSpan = '';
    let timeSpanValue = 0;
    if (time.years > 0) {
      timeSpan = time.years === 1 ? $localize`año` : $localize`años`;
      timeSpanValue = time.years;
    } else if (time.days > 0) {
      timeSpan = time.days === 1 ? $localize`día` : $localize`días`;
      timeSpanValue = time.days;
    } else if (time.hours > 0) {
      timeSpan = time.hours === 1 ? $localize`hora` : $localize`horas`;
      timeSpanValue = time.hours;
    } else if (time.minutes > 0) {
      timeSpan = time.minutes === 1 ? $localize`minuto` : $localize`minutos`;
      timeSpanValue = time.minutes;
    } else if (time.seconds > 0) {
      timeSpan = time.seconds === 1 ? $localize`segundo` : $localize`segundos`;
      timeSpanValue = time.seconds;
    }

    const calculatedNotificationText = `Hace ${timeSpanValue} ${timeSpan}`;

    const notificationText = notificationItems[0].nativeElement.textContent;
    expect(notificationText)
      .withContext('You should have a notification text inside the li tag')
      .toContain(`Test Family ha: Cancelado${calculatedNotificationText}`);
  });
});
