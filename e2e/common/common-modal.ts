import { Locator, Page } from '@playwright/test';
import { BaseModal } from 'e2e/common/base-modal';

export class CommonModal extends BaseModal {
  readonly modalContent: Locator;

  constructor(page: Page) {
    super(page, '#commonModal');
    this.modalContent = this.modalLocator.locator('.modal-body');
  }

  async getModalContent() {
    return this.modalContent.textContent();
  }

  async isModalVisible() {
    return this.modalLocator.isVisible();
  }
}
