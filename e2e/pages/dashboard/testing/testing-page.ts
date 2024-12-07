import { expect, Locator, Page } from '@playwright/test';
import { DashboardPage } from '../dashboard-page';

export class TestingPage extends DashboardPage {
  readonly breadcrumbHeader: Locator;
  readonly cleanEnvironmentButton: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbHeader = page.locator('.breadcrumb li', {
      hasText: 'TESTING',
    });
    this.cleanEnvironmentButton = this.page.locator('button', {
      hasText: 'Clean Environment',
    });
  }

  override async goto(): Promise<void> {
    await super.goto('/dashboard/testing');
    await this.isTestingPage();
  }

  async isTestingPage() {
    expect(this.breadcrumbHeader, {
      message: 'Testing breadcrumb should be visible',
    }).toBeVisible();
  }

  async clickCleanEnvironmentButton() {
    await this.cleanEnvironmentButton.click();
  }
}
