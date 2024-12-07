import test, { expect } from '@playwright/test';
import { getFormattedDate } from 'e2e/helper/date-format';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { LogsPage } from 'e2e/pages/dashboard/logs/logs-page';

test.describe('Dashboard Logs', () => {
  let logsPage: LogsPage;

  // Login as admin before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();

    await dashboardPage.clickLogsLink();
    logsPage = new LogsPage(page);
    await logsPage.waitToLoad();
  });

  test('should be able to see the all the charts', async () => {
    await expect(logsPage.last31DaysChart, {
      message: 'Last 31 days chart should be visible',
    }).toBeVisible();
  });

  test('should render all the entries statistics', async () => {
    expect(await logsPage.getTotalErrorsLast31Days(), {
      message: 'Total errors in the last 31 days should be defined',
    }).toBeDefined();

    expect(await logsPage.getTotalErrorsToday(), {
      message: 'Total errors for today should be defined',
    }).toBeDefined();
  });

  test('should be able to see the log modal', async () => {
    const rowColumns = await logsPage.getTableRowData(0);
    const logModal = await logsPage.clickViewLog(0);
    await logModal.waitToLoad();

    expect(await logModal.dateOfError.inputValue(), {
      message: 'Date of error should be visible in the log modal',
    }).toBe(
      getFormattedDate(rowColumns[0], {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );

    expect(await logModal.error.inputValue(), {
      message: 'Error message should be visible in the log modal',
    }).toBe(rowColumns[1]);

    expect(await logModal.exception.inputValue(), {
      message: 'Exception should be visible in the log modal',
    }).not.toBe('');

    expect(await logModal.username.inputValue(), {
      message: 'Username should be visible in the log modal',
    }).toBe(rowColumns[2]);
  });
});
