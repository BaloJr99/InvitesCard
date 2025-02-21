import { Locator, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly spinner: Locator;
  readonly toastr: Locator;

  constructor(page: Page) {
    this.page = page;
    this.spinner = page.locator('.cssload-container.show');
    this.toastr = page.locator('.toast-container');
  }

  /**
   * Waits for the spinner to load and disappear.
   * Logs a message if the page or context is closed.
   */
  async waitToLoad(): Promise<void> {
    try {
      if (await this.spinner.isVisible()) {
        while (await this.spinner.isVisible()) {
          if (this.page.isClosed()) {
            console.log('Page or context has been closed');
            return;
          }
          await this.spinner.waitFor({ state: 'hidden', timeout: 5000 });
        }
      }
    } catch (error) {
      console.error(
        `Error while waiting for spinner: ${(error as Error).message}`
      );
    }
  }

  /**
   * Navigates to the specified path.
   * @param path - The path to navigate to.
   */
  async goto(path: string): Promise<void> {
    try {
      await this.page.goto(path);
      await this.page.waitForURL(path, {
        waitUntil: 'domcontentloaded',
      });
    } catch (error) {
      console.error(
        `Error while navigating to ${path}: ${(error as Error).message}`
      );
    }
  }

  /**
   * Checks if the toastr is showing and clicks it if visible.
   */
  async waitForToast(): Promise<void> {
    try {
      await this.toastr.waitFor({ state: 'visible', timeout: 5000 });
      if (await this.toastr.isVisible()) {
        await this.toastr.click();
      }
      await this.toastr.waitFor({ state: 'hidden', timeout: 5000 });
      await this.toastr.isVisible();
    } catch (error) {
      console.error(`Error while checking toastr: ${(error as Error).message}`);
    }
  }
}
