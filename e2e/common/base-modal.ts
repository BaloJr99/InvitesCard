import { Locator, Page } from '@playwright/test';

export class BaseModal {
  readonly page: Page;
  readonly modalLocator: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page, modalLocator: string) {
    this.page = page;
    console.log('Modal locator: ', modalLocator);
    this.modalLocator = page.locator(modalLocator);
    this.confirmButton = this.modalLocator.getByTestId('confirm-button');
    this.cancelButton = this.modalLocator.getByTestId('cancel-button');
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async waitForModalToShow() {
    await this.modalLocator.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }

  async waitForModalToHide() {
    await this.modalLocator.waitFor({
      state: 'hidden',
      timeout: 10000,
    });
  }
}
