import { test, expect } from '@playwright/test';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { DashboardPage } from 'e2e/pages/dashboard/dashboard-page';
import { fullUserMock } from 'src/tests/mocks/mocks';

test.describe('Dashboard Page', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();
    await dashboardPage.isDashboardPage();
  });

  test('admin should be able to see 7 navigation links', async () => {
    const adminNavigationLinks = [
      'HOME',
      'EVENTS',
      'FILES',
      'USERS',
      'LOGS',
      'TESTING',
      'SETTINGS',
    ];

    const navigationLinks = await dashboardPage.getNavigationLinks();

    expect(navigationLinks.length, {
      message: 'Admin should see 7 navigation links',
    }).toBe(7);

    for (let i = 0; i < navigationLinks.length; i++) {
      const linkText = await navigationLinks[i].textContent();
      expect(linkText, {
        message: 'Admin should see the correct navigation links',
      }).toContain(adminNavigationLinks[i]);
    }
  });

  test('should be able to see the profile card', async () => {
    await dashboardPage.clickToggleProfileButton();

    const profileCard = await dashboardPage.getProfileCard();
    await expect(profileCard, {
      message: 'Profile card should be visible',
    }).toBeVisible();

    const profileUsername = await profileCard.locator('h3').textContent();
    expect(profileUsername, {
      message: 'Profile card should have the correct username',
    }).toContain(fullUserMock.username);

    const profileEmail = await profileCard.locator('h3 span').textContent();
    expect(fullUserMock.email, {
      message: 'Profile card should have the correct email',
    }).toContain(profileEmail);

    const profileLinks = await profileCard.locator('a').all();

    const expectedProfileLinks = ['My profile', 'Settings', 'Logout'];
    for (let i = 0; i < profileLinks.length; i++) {
      const linkText = await profileLinks[i].textContent();
      expect(linkText, {
        message: 'Profile card should have the correct links',
      }).toContain(expectedProfileLinks[i]);
    }
  });
});
