import { Locator, Page } from '@playwright/test';
import { BaseModal } from 'e2e/common/base-modal';
import { uploadFilesPath } from 'e2e/helper/upload-files';

export class ProfileModal extends BaseModal {
  readonly imageContainer: Locator;
  readonly photoFilesInput: Locator;

  constructor(page: Page) {
    super(page, '#profileModal');
    this.imageContainer = this.modalLocator.locator('.image-container');
    this.photoFilesInput = this.modalLocator.locator('#photoFiles');
  }

  async uploadPhoto() {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.photoFilesInput.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(uploadFilesPath('test.png'));
  }

  async isImageVisible() {
    return this.imageContainer.isVisible();
  }
}
