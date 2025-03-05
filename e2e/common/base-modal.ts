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

  async clickConfirmButtonAndReturnId(): Promise<string> {
    const responsePromise = this.page.waitForResponse('**/api/**');
    await this.clickConfirmButton();
    const response = await responsePromise;
    return JSON.parse((await response.body()).toString())['id'];
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async waitForModalToShow() {
    try {
      if (!(await this.modalLocator.isVisible())) {
        while (!(await this.modalLocator.isVisible())) {
          try {
            await this.modalLocator.waitFor({
              state: 'visible',
              timeout: 5000,
            });
          } catch {
            console.log('Modal is still hidden');
          }
        }
      }
    } catch (error) {
      console.error(
        `Error while waiting for modal to show: ${(error as Error).message}`
      );
    }
  }

  async waitForModalToHide() {
    try {
      while (await this.page.locator('.modal-backdrop').isVisible()) {
        try {
          await this.page.locator('.modal-backdrop').waitFor({
            state: 'hidden',
            timeout: 5000,
          });
        } catch {
          console.log('Modal still visible');
        }
      }
    } catch (error) {
      console.error(
        `Error while waiting for modal to hide: ${(error as Error).message}`
      );
    }
  }
}
