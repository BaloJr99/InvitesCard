import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/auth/login-page';
import { ForgotPasswordPage } from '../pages/auth/forgot-password-page';
import { PasswordResetPage } from 'e2e/pages/auth/password-reset-page';
import { fullUserMock } from 'src/tests/mocks/mocks';

test.describe('Authentication', () => {
  test('should show validation messages when fields are empty', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login('', '');

    await expect(loginPage.usernameError).toHaveText(
      'The username or email are required'
    );
    await expect(loginPage.passwordError).toHaveText(
      'The password is required'
    );
  });

  test("shouldn't login", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login('admin', 'admin');

    await expect(loginPage.errorMessage).toHaveText('Wrong credentials');
  });

  test('should login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();
    await dashboardPage.isDashboardPage();
  });

  test(`should show validation message when field is empty`, async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickResetPassword();

    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.isForgotPasswordPage();
    await forgotPasswordPage.resetPassword('');

    await expect(forgotPasswordPage.usernameOrEmailErrorMessage).toHaveText(
      'The username or email are required'
    );
  });

  test(`should show emailSent when email is sent`, async ({ page }) => {
    let loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickResetPassword();

    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.isForgotPasswordPage();
    await forgotPasswordPage.resetPassword(fullUserMock.email);

    loginPage = await forgotPasswordPage.checkEmailSentSuccessMessage();
    await loginPage.isLoginPage();
  });

  test(`should navigate to password reset`, async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.resetPassword(fullUserMock.email);
    await forgotPasswordPage.waitToLoad();
    await forgotPasswordPage.checkEmailSentSuccessMessage();

    const passwordResetPage = new PasswordResetPage(page);
    await passwordResetPage.goto();
    await passwordResetPage.isPasswordResetPage();
  });

  test(`should show validation error when fields are empty`, async ({
    page,
  }) => {
    const passwordResetPage = new PasswordResetPage(page);
    passwordResetPage.goto();
    await passwordResetPage.isPasswordResetPage();

    await passwordResetPage.resetPassword('', '');

    await expect(passwordResetPage.passwordErrorMessage).toHaveText(
      'The password is required'
    );
    await expect(passwordResetPage.confirmPasswordErrorMessage).toHaveText(
      'Confirm Password'
    );
  });

  test(`should show validation error when fields are different`, async ({
    page,
  }) => {
    const passwordResetPage = new PasswordResetPage(page);
    passwordResetPage.goto();
    await passwordResetPage.isPasswordResetPage();

    await passwordResetPage.resetPassword(fullUserMock.password, 'P4ssw0rd1');

    await expect(passwordResetPage.matchPasswordErrorMessage).toHaveText(
      "The password doesn't match"
    );
  });

  test(`should be able to reset password`, async ({ page }) => {
    const passwordResetPage = new PasswordResetPage(page);
    passwordResetPage.goto();
    await passwordResetPage.isPasswordResetPage();

    await passwordResetPage.resetPassword(
      fullUserMock.password,
      fullUserMock.password
    );

    await passwordResetPage.checkPasswordChangedSuccessMessage();
  });

  test(`shouldn't be able to reset password once it's changed`, async ({
    page,
  }) => {
    const passwordResetPage = new PasswordResetPage(page);
    await passwordResetPage.goto();
    await passwordResetPage.isPasswordResetPage(false);
  });
});
