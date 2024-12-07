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
    if (await this.spinner.isVisible()) {
      await this.spinner.waitFor({ state: 'hidden' });
    }

    try {
      await this.spinner.waitFor({ state: 'visible', timeout: 1000 });
    } catch {
      console.log('Spinner was hidden');
    }

    if (await this.spinner.isVisible()) {
      await this.waitToLoad();
    }

    return this.page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async toastrIsShowing(): Promise<boolean> {
    return await this.toastr.isVisible();
  }
}
