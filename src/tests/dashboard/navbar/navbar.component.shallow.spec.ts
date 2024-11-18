import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { NavbarComponent } from 'src/app/dashboard/navbar/navbar.component';
import { notificationsMock, userMock } from 'src/tests/mocks/mocks';

describe('Navbar Component (Shallow Test)', () => {
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(waitForAsync(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', {
      getTokenValues: userMock,
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

    const userHeading = baseMenu.query(By.css('h3'));

    expect(userHeading)
      .withContext('You should have a h3 tag inside the base-menu')
      .toBeTruthy();

    expect(userHeading.nativeElement.textContent)
      .withContext('You should have the username inside the h3 tag')
      .toContain(userMock.username);

    expect(userHeading.nativeElement.textContent)
      .withContext('You should have the email inside the h3 tag')
      .toContain(userMock.email);

    const menuItems = baseMenu.queryAll(By.css('ul li'));

    expect(menuItems.length)
      .withContext('You should have 3 items inside the menu')
      .toBe(3);

    const textToMatch = ['Mi perfil', 'Configuración', 'Cerrar sesión'];
    menuItems.map(
      (item, index) => item.nativeElement.textContent === textToMatch[index]
    );
  });

  it('should have a base-menu notificationMessages with 1 notification in the menu', () => {
    fixture.componentRef.setInput('notificationsValue', notificationsMock);
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

    const notificationText = notificationItems[0].nativeElement.textContent;
    expect(notificationText)
      .withContext('You should have a notification text inside the li tag')
      .toContain('Test Family ha: CanceladoHace 3 años');
  });
});
