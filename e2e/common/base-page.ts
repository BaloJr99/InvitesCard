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
    const initialUrl = this.page.url();
    try {
      if ((await this.spinner.isVisible()) && this.page.url() === initialUrl) {
        while (
          (await this.spinner.isVisible()) &&
          this.page.url() === initialUrl
        ) {
          try {
            await this.spinner.waitFor({ state: 'hidden', timeout: 5000 });
          } catch {
            console.log('Spinner is still visible');
          }
        }
      }

      if (await this.spinner.isVisible()) {
        // Retry again with new url
        await this.waitToLoad();
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
      if (await this.toastr.isVisible()) {
        await this.toastr.click();
        while (await this.toastr.isVisible()) {
          try {
            await this.toastr.waitFor({ state: 'hidden', timeout: 5000 });
          } catch {
            console.log('Toastr is still visible');
          }
        }
      }

      if (await this.toastr.isVisible()) {
        await this.waitForToast();
      }
    } catch (error) {
      console.error(
        `Error while waiting for toastr: ${(error as Error).message}`
      );
    }
  }
}
