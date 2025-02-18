import { test, expect } from '@playwright/test';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { HomePage } from 'e2e/pages/dashboard/home/home-page';
import { TestingPage } from 'e2e/pages/dashboard/testing/testing-page';

test.describe('Home Page', () => {
  let homePage: HomePage;
  let environmentCleaned = false;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const dashboardPage = await loginPage.loginAsAdmin();

    if (!environmentCleaned) {
      await dashboardPage.clickTestingLink();
      const testingPage = new TestingPage(page);
      await testingPage.clickCleanEnvironmentButton();

      await testingPage.clickHomeLink();
      await testingPage.waitToLoad();
      environmentCleaned = true;
    }

    homePage = new HomePage(page);
  });

  test('should be able to see the all the charts', async () => {
    await expect(homePage.allEntriesChart, {
      message: 'All entries chart should be visible',
    }).toBeVisible();

    await expect(homePage.last31DaysChart, {
      message: 'Last 31 days chart should be visible',
    }).toBeVisible();
  });

  test('should render all the entries statistics', async () => {
    expect(await homePage.getAllEntriesStatistics(), {
      message: 'Entries statistics should be visible',
    }).toEqual({
      confirmedEntries: 0,
      pendingEntries: 0,
      cancelledEntries: 0,
      totalEntries: 0,
    });

    expect(await homePage.getPercentageOfConfirmedEntries(), {
      message: 'Percentage of confirmed entries should be zero',
    }).toBe(0);

    expect(await homePage.getPercentageOfPendingEntries(), {
      message: 'Percentage of cancelled entries should be zero',
    }).toBe(0);
  });
});
