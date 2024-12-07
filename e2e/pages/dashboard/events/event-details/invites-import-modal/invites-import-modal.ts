import { Locator, Page } from '@playwright/test';
import { BaseModal } from 'e2e/common/base-modal';
import { uploadFilesPath } from 'e2e/helper/upload-files';

export class InviteImportModal extends BaseModal {
  readonly fileInput: Locator;
  readonly downloadTemplateButton: Locator;

  constructor(page: Page) {
    super(page, '#invitesImportModal');
    this.fileInput = this.modalLocator.locator('#fileInput');
    this.downloadTemplateButton = this.modalLocator.locator(
      '.download-template button'
    );
  }

  async uploadFile(filePath: string) {
    await this.fileInput.setInputFiles(uploadFilesPath(filePath));
  }

  async getValidationErrors() {
    const error = await this.modalLocator
      .locator('.invalid-feedback')
      .allTextContents();
    return error;
  }
}
