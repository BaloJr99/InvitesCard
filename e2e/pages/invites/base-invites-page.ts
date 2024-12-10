import { Locator, Page } from '@playwright/test';
import { BasePage } from 'e2e/common/base-page';

export class BaseInvitesPage extends BasePage {
  readonly loader: Locator;

  constructor(page: Page) {
    super(page);
    this.loader = page.locator('.cssload-container iframe');
  }

  async waitForInviteToLoad() {
    if (await this.loader.isVisible()) {
      await this.loader.waitFor({ state: 'hidden' });
    }

    try {
      await this.loader.waitFor({ state: 'visible', timeout: 1000 });
    } catch {
      console.log('Loader was hidden');
    }

    if (await this.loader.isVisible()) {
      await this.waitForInviteToLoad();
    }

    return this.page;
  }

  async gotoInvitePage(url: string) {
    await this.page.goto(url);
  }
}
