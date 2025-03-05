import { expect, Locator, Page } from '@playwright/test';
import { DashboardPage } from '../dashboard-page';

export abstract class SettingsPage extends DashboardPage {
  readonly breadcrumbHeader: Locator;
  readonly eventSelect: Locator;
  readonly filesEmptyMessage: Locator;
  readonly saveChangesButton: Locator;
  readonly cancelChangesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbHeader = page.locator('.breadcrumb-header li', {
      hasText: 'SETTINGS',
    });
    this.eventSelect = page.locator('#event-select');
    this.filesEmptyMessage = page.locator('.files-empty p');

    this.saveChangesButton = page.locator('button', {
      hasText: 'Save changes',
    });
    this.cancelChangesButton = page.locator('button', {
      hasText: 'Cancel changes',
    });
  }

  async isSettingsPage() {
    await this.breadcrumbHeader.waitFor({ state: 'visible', timeout: 5000 });
    expect(this.breadcrumbHeader, {
      message: 'Settings breadcrumb should be visible',
    }).toBeVisible();
  }

  async selectEvent(event: string) {
    await this.eventSelect.selectOption({ label: event });
    await this.waitToLoad();
  }

  async clickSaveChanges() {
    await this.saveChangesButton.click();
    await this.waitToLoad();
    await this.waitForToast();
  }

  async clickCancelChanges() {
    await this.cancelChangesButton.click();
  }

  async getValidationErrors() {
    const errors = await this.page
      .locator('.invalid-feedback')
      .allTextContents();
    return errors;
  }
}
