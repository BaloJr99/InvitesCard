import { Locator, Page } from '@playwright/test';
import { BasePage } from 'e2e/common/base-page';

export class BaseInvitesPage extends BasePage {
  readonly loader: Locator;

  constructor(page: Page) {
    super(page);
    this.loader = page.locator('.cssload-container iframe');
  }

  async waitForInviteToLoad() {
    try {
      // Wait for the invite loader to appear
      if (await this.loader.isVisible()) {
        while (await this.loader.isVisible()) {
          if (this.page.isClosed()) {
            console.log('Page or context has been closed');
            return;
          }
          await this.loader.waitFor({ state: 'hidden', timeout: 5000 });
        }
      } else {
        // Wait for the generic loader to appear
        this.waitToLoad();
      }
    } catch (error) {
      console.error(
        `Error while waiting for loader: ${(error as Error).message}`
      );
    }
  }

  async gotoInvitePage(url: string) {
    await this.page.goto(url);
    await this.page.waitForURL(url, {
      waitUntil: 'domcontentloaded',
    });
  }
}
