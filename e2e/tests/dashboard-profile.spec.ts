import test, { expect } from '@playwright/test';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { ProfilePage } from 'e2e/pages/dashboard/profile/profile-page';
import { userProfileMock } from 'src/tests/mocks/mocks';

test.describe('Dashboard Profile', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();

    await dashboardPage.clickToggleProfileButton();
    await dashboardPage.clickProfileButton();
    profilePage = new ProfilePage(page);
    await profilePage.waitToLoad();
  });

  test('should display our profile page', async () => {
    await profilePage.isProfilePage();

    expect(await profilePage.getProfileFullName(), {
      message: 'Profile full name should be displayed',
    }).toBe(`${userProfileMock.firstName} ${userProfileMock.lastName}`);

    expect(await profilePage.getProfileEmail(), {
      message: 'Profile email should be displayed',
    }).toBe(userProfileMock.email);
  });

  test('should be able to see the change password button', async () => {
    expect(await profilePage.changePasswordButton.textContent(), {
      message: 'Change password button should be displayed',
    }).toContain('Change my password');

    await profilePage.clickChangePassword();

    expect(await profilePage.isChangePasswordCardVisible(), {
      message: 'Change password card should be visible',
    }).toBeTruthy();
  });

  test('should be able to see validation errors', async () => {
    await profilePage.fillProfileInfo('', '', '', '', '', '');

    const expectedValidationErrors = [
      ' The first name is required  ',
      ' The last name is required  ',
      ' The username is required  ',
      ' The gender is required  ',
      ' The email is required  ',
      ' The phone number is required  ',
    ];
    expect(await profilePage.getValidationErrors(), {
      message: 'Validation errors should be displayed',
    }).toEqual(expectedValidationErrors);
  });
});
