import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/base-page';
import { LoginPage } from './login-page';

export class ForgotPasswordPage extends BasePage {
  readonly mainHeader: Locator;
  readonly usernameOrEmailInput: Locator;
  readonly submitButton: Locator;
  readonly usernameOrEmailErrorMessage: Locator;
  readonly goToLoginPageLink: Locator;

  constructor(page: Page) {
    super(page);
    this.mainHeader = page.locator('h1', { hasText: 'Forgot Password' });
    this.usernameOrEmailInput = page.locator('#usernameOrEmail');
    this.submitButton = page.locator('#resetPasswordButton');
    this.usernameOrEmailErrorMessage = page.locator('.invalid-feedback').nth(0);
    this.goToLoginPageLink = page.locator('a');
  }

  override async goto() {
    await super.goto('/auth/forgotPassword');
    await this.isForgotPasswordPage();
  }

  async isForgotPasswordPage() {
    await expect(this.mainHeader, {
      message: 'Forgot password page should be visible',
    }).toBeVisible();
  }

  async resetPassword(usernameOrEmail: string) {
    await this.usernameOrEmailInput.fill(usernameOrEmail);
    await this.submitButton.click();

    await this.waitToLoad();
  }

  async checkEmailSentSuccessMessage() {
    const emailSentMessage = this.page.getByTestId('emailSent');

    const firstParagraph = emailSentMessage.locator('p').first();
    const secondParagraph = emailSentMessage.locator('p').nth(1);

    await expect(emailSentMessage).toBeVisible();
    await expect(firstParagraph).toHaveText(
      'An email has been sent to the associated account, which contains instructions to proceed with the process.'
    );
    await expect(secondParagraph).toHaveText(
      'The email could take a few minutes to appear in you inbox or junk email'
    );

    await this.goToLoginPageLink.click();

    return new LoginPage(this.page);
  }
}
