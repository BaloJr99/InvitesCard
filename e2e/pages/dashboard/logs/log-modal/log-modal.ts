import { Locator, Page } from '@playwright/test';
import { BaseModal } from 'e2e/common/base-modal';

export class LogModal extends BaseModal {
  readonly dateOfError: Locator;
  readonly error: Locator;
  readonly exception: Locator;
  readonly username: Locator;

  constructor(page: Page) {
    super(page, '#logModal');
    this.dateOfError = this.modalLocator.locator('#dateOfError');
    this.error = this.modalLocator.locator('#customError');
    this.exception = this.modalLocator.locator('#exceptionMessage');
    this.username = this.modalLocator.locator('#userId');
  }
}
