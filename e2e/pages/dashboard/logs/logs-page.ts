import { expect, Locator, Page } from '@playwright/test';
import { DashboardPage } from '../dashboard-page';
import { TableHelper } from 'e2e/common/table';
import { LogModal } from './log-modal/log-modal';

export class LogsPage extends DashboardPage {
  readonly breadcrumbHeader: Locator;
  readonly last31DaysChart: Locator;
  readonly percentageHistory: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbHeader = page.locator('.breadcrumb-header li', {
      hasText: 'LOGS',
    });
    this.last31DaysChart = page.locator('canvas[id="historyChart"]');
    this.percentageHistory = page.locator('.percentage-history');
  }

  override async goto() {
    await super.goto('/dashboard/logs');
    await this.isLogsPage();
  }

  async isLogsPage() {
    await this.breadcrumbHeader.waitFor({ state: 'visible', timeout: 5000 });
    expect(this.breadcrumbHeader, {
      message: 'Logs breadcrumb should be visible',
    }).toBeVisible();
  }

  async getTotalErrorsLast31Days(): Promise<number> {
    await this.percentageHistory.waitFor({ state: 'visible' });
    const historyCards = await this.percentageHistory.locator('.card').all();
    const totalErrorsLast31Days = await historyCards[0]
      .locator('span')
      .innerText();
    return parseInt(totalErrorsLast31Days);
  }

  async getTotalErrorsToday(): Promise<number> {
    await this.percentageHistory.waitFor({ state: 'visible' });
    const historyCards = await this.percentageHistory.locator('.card').all();
    const totalErrorsToday = await historyCards[1].locator('span').innerText();
    return parseInt(totalErrorsToday);
  }

  async getTableRowData(rowIndex: number) {
    await this.page.waitForSelector('#logsTable', { state: 'visible' });
    const table = new TableHelper(this.page, 'logsTable');
    const row = await table.getTableRowByIndex(rowIndex);

    return row.locator('td').allTextContents();
  }

  async clickViewLog(rowIndex: number) {
    const table = new TableHelper(this.page, 'logsTable');
    const row = await table.getTableRowByIndex(rowIndex);

    await row.locator('td:last-child button').click();
    return new LogModal(this.page);
  }
}
