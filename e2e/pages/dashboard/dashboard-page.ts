import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/base-page';
import { LoginPage } from '../auth/login-page';

export class DashboardPage extends BasePage {
  readonly mainHeader: Locator;
  readonly navigationSidebar: Locator;
  readonly homeLink: Locator;
  readonly eventsLink: Locator;
  readonly filesLink: Locator;
  readonly usersLink: Locator;
  readonly logsLink: Locator;
  readonly testingLink: Locator;
  readonly settingsLink: Locator;
  readonly toggleProfileButton: Locator;
  readonly profileCard: Locator;
  readonly myProfileButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.mainHeader = page.locator('h1', { hasText: 'Dashboard' });

    this.navigationSidebar = page.locator('.sidebar');
    this.homeLink = this.navigationSidebar.locator('a', { hasText: 'HOME' });
    this.eventsLink = this.navigationSidebar.locator('a', {
      hasText: 'EVENTS',
    });
    this.filesLink = this.navigationSidebar.locator('a', { hasText: 'FILES' });
    this.usersLink = this.navigationSidebar.locator('a', { hasText: 'USERS' });
    this.logsLink = this.navigationSidebar.locator('a', { hasText: 'LOGS' });
    this.testingLink = this.navigationSidebar.locator('a', {
      hasText: 'TESTING',
    });
    this.settingsLink = this.navigationSidebar.locator('a', {
      hasText: 'SETTINGS',
    });
    this.toggleProfileButton = page.locator('nav button').nth(0);
    this.profileCard = page.locator('.base-menu.menu');
    this.logoutButton = this.profileCard.locator('button', {
      hasText: 'Logout',
    });
    this.myProfileButton = this.profileCard.locator('a', {
      hasText: 'My profile',
    });
  }

  async isDashboardPage() {
    await expect(this.mainHeader, {
      message: 'Dashboard page should be visible',
    }).toBeVisible();
  }

  async getNavigationLinks() {
    return this.navigationSidebar.locator('a').all();
  }

  async clickHomeLink() {
    await this.homeLink.click();
  }

  async clickEventsLink() {
    await this.eventsLink.click();
  }

  async clickFilesLink() {
    await this.filesLink.click();
  }

  async clickUsersLink() {
    await this.usersLink.click();
  }

  async clickLogsLink() {
    await this.logsLink.click();
  }

  async clickTestingLink() {
    await this.testingLink.click();
  }

  async clickSettingsLink() {
    await this.settingsLink.click();
  }

  async clickToggleProfileButton() {
    await this.toggleProfileButton.click();
  }

  async getProfileCard() {
    return this.profileCard;
  }

  async clickLogoutButton() {
    await this.clickToggleProfileButton();
    await this.logoutButton.click();

    return new LoginPage(this.page);
  }

  async clickProfileButton() {
    await this.clickToggleProfileButton();
    await this.myProfileButton.click();
  }
}
