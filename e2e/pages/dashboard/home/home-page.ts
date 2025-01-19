import { expect, Locator, Page } from '@playwright/test';
import { IStatistics } from 'e2e/helper/models';
import { DashboardPage } from 'e2e/pages/dashboard/dashboard-page';

export class HomePage extends DashboardPage {
  readonly breadcrumbHeader: Locator;
  readonly allEntriesChart: Locator;
  readonly last31DaysChart: Locator;
  readonly percentageHistory: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbHeader = page.locator('.breadcrumb li', { hasText: 'HOME' });
    this.allEntriesChart = page.locator('canvas[id="historyChart"]');
    this.last31DaysChart = page.locator('canvas[id="lastInvitesData"]');
    this.percentageHistory = page.locator('.percentage-history');
  }

  override async goto() {
    await super.goto('/dashboard/home');
    await this.isHomePage();
  }

  async isHomePage() {
    expect(this.breadcrumbHeader, {
      message: 'Home breadcrumb should be visible',
    }).toBeVisible();
  }

  async getAllEntriesStatistics(): Promise<IStatistics> {
    const rows = await this.page.locator('table tr').all();
    const confirmedEntries = await rows[1].locator('td').nth(1).innerText();
    const pendingEntries = await rows[2].locator('td').nth(1).innerText();
    const cancelledEntries = await rows[3].locator('td').nth(1).innerText();
    const totalEntries = await rows[4].locator('td').nth(1).innerText();

    return {
      confirmedEntries: parseInt(confirmedEntries),
      pendingEntries: parseInt(pendingEntries),
      cancelledEntries: parseInt(cancelledEntries),
      totalEntries: parseInt(totalEntries),
    };
  }

  async getPercentageOfConfirmedEntries(): Promise<number> {
    const percentageCards = await this.percentageHistory.locator('.card').all();
    const percentageOfConfirmedEntries = await percentageCards[0]
      .locator('span')
      .innerText();
    return parseInt(percentageOfConfirmedEntries);
  }

  async getPercentageOfPendingEntries(): Promise<number> {
    const percentageCards = await this.percentageHistory.locator('.card').all();
    const percentageOfPendingEntries = await percentageCards[1]
      .locator('span')
      .innerText();
    return parseInt(percentageOfPendingEntries);
  }
}
