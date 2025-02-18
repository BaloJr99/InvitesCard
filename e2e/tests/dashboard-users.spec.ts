import test, { expect } from '@playwright/test';
import { testRoleMock, testUserMock } from 'e2e/helper/mocks';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { TestingPage } from 'e2e/pages/dashboard/testing/testing-page';
import { UsersPage } from 'e2e/pages/dashboard/users/users-page';

test.describe('Dashboard users', () => {
  let environmentCleaned = false;
  let usersPage: UsersPage;

  // Login as admin before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();

    // Clean environment and create a new event
    if (!environmentCleaned) {
      await dashboardPage.clickTestingLink();
      const testingPage = new TestingPage(page);
      await testingPage.clickCleanEnvironmentButton();
      await testingPage.clickUsersLink();
      environmentCleaned = true;
    } else {
      await dashboardPage.clickUsersLink();
    }

    usersPage = new UsersPage(page);
    await usersPage.waitToLoad();
  });

  test('should be able to see users page', async () => {
    await usersPage.isUsersPage();
  });

  test('should be able to see roles modal validation errors', async () => {
    const rolesModal = await usersPage.clickNewRoleButton();
    await rolesModal.waitForModalToShow();
    await rolesModal.clickConfirmButton();

    const expectedErrors = ['The role name is required'];

    const errors = await rolesModal.getValidationErrors();
    errors.forEach(async (error, index) => {
      expect(await error.textContent()).toContain(expectedErrors[index]);
    });
  });

  test('should be able to add new role', async () => {
    const rolesModal = await usersPage.clickNewRoleButton();
    await rolesModal.waitForModalToShow();

    await rolesModal.fillForm(testRoleMock.roleName, testRoleMock.isActive);
    await rolesModal.clickConfirmButton();
    await usersPage.waitToLoad();
    await usersPage.waitForToast();
  });

  test('should be able to see users modal validation errors', async () => {
    const usersModal = await usersPage.clickNewUserButton();
    await usersModal.waitForModalToShow();
    await usersModal.clickConfirmButton();

    const expectedErrors = [
      'The username is required',
      'The email is required',
      'Select a role',
    ];

    const errors = await usersModal.getValidationErrors();
    errors.forEach(async (error, index) => {
      expect(await error.textContent()).toContain(expectedErrors[index]);
    });
  });

  test('should be able to add new user', async () => {
    const usersModal = await usersPage.clickNewUserButton();
    await usersModal.waitForModalToShow();

    await usersModal.fillForm(
      testUserMock.username,
      testUserMock.email,
      testUserMock.roles,
      testUserMock.isActive
    );
    await usersModal.clickConfirmButton();
    await usersPage.waitToLoad();
    await usersPage.waitForToast();
  });
});
