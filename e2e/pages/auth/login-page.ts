import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../common/base-page';
import { DashboardPage } from '../dashboard/dashboard-page';
import { fullUserMock } from 'src/tests/mocks/mocks';

export class LoginPage extends BasePage {
  readonly mainHeader: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    super(page);

    this.mainHeader = page.locator('h1', { hasText: 'Sign In' });

    this.usernameInput = page.locator('#usernameOrEmail');
    this.passwordInput = page.locator('#password');
    this.forgotPasswordLink = page.locator('#forgotPassword > a');
    this.loginButton = page.getByRole('button');

    this.errorMessage = page.getByTestId('authErrorMessage');
    this.usernameError = page.locator('.invalid-feedback').nth(0);
    this.passwordError = page.locator('.invalid-feedback').nth(1);
  }

  override async goto() {
    await this.page.goto('/auth/login');
  }

  async isLoginPage() {
    await expect(this.mainHeader, {
      message: 'Login page should be visible',
    }).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.waitToLoad();

    return new DashboardPage(this.page);
  }

  async loginAsAdmin() {
    await this.login(fullUserMock.username, fullUserMock.password);
    await this.waitToLoad();
    return new DashboardPage(this.page);
  }

  async clickResetPassword() {
    await this.forgotPasswordLink.click();
  }
}
