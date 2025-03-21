import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/base-page';
import { LoginPage } from './login-page';
import { fullUserMock } from 'src/tests/mocks/mocks';

export class PasswordResetPage extends BasePage {
  readonly mainHeader: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly passwordErrorMessage: Locator;
  readonly confirmPasswordErrorMessage: Locator;
  readonly matchPasswordErrorMessage: Locator;
  readonly goToLoginPageLink = this.page.locator('a');

  constructor(page: Page) {
    super(page);
    this.mainHeader = this.page.locator('h1', { hasText: 'Reset Password' });
    this.passwordInput = this.page.locator('#password');
    this.confirmPasswordInput = this.page.locator('#confirmPassword');
    this.submitButton = this.page.locator('#resetPasswordButton');
    this.passwordErrorMessage = this.page.locator('.invalid-feedback').nth(0);
    this.confirmPasswordErrorMessage = this.page
      .locator('.invalid-feedback')
      .nth(1);
    this.matchPasswordErrorMessage = this.page
      .locator('.invalid-feedback')
      .nth(0);
  }

  override async goto() {
    await this.page.goto(`/auth/forgotPassword/${fullUserMock.id}`, {
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForURL('/auth/forgotPassword/*', {
      waitUntil: 'domcontentloaded',
    });
    await this.isPasswordResetPage();
    await this.waitToLoad();
  }

  async isPasswordResetPage() {
    await expect(this.mainHeader, {
      message: 'Password reset page should be visible',
    }).toBeVisible();
  }

  async resetPassword(password: string, confirmPassword: string) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.submitButton.click();
    await this.waitToLoad();
  }

  async checkPasswordChangedSuccessMessage() {
    const passwordResetMessage = this.page.getByTestId('passwordReset');

    const firstParagraph = passwordResetMessage.locator('p').first();

    await expect(passwordResetMessage).toBeVisible();
    await expect(firstParagraph).toHaveText(
      'Your password has been changed successfully'
    );

    await this.goToLoginPageLink.click();

    return new LoginPage(this.page);
  }
}
