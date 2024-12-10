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

  async waitToLoad() {
    try {
      await this.spinner.waitFor({ state: 'visible', timeout: 1000 });
      if (await this.spinner.isVisible()) {
        await this.spinner.waitFor({ state: 'hidden' });
      }
    } catch {
      console.log(`Spinner wasn't found`);
    }
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async toastrIsShowing(): Promise<boolean> {
    return await this.toastr.isVisible();
  }
}
