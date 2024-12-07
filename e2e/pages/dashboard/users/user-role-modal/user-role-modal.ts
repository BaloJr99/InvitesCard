import { Locator, Page } from '@playwright/test';
import { BaseModal } from 'e2e/common/base-modal';

export class RoleModal extends BaseModal {
  readonly nameInput: Locator;
  readonly roleIsActiveCheckbox: Locator;

  constructor(page: Page) {
    super(page, '#rolesModal');
    this.nameInput = this.modalLocator.locator('#name');
    this.roleIsActiveCheckbox = this.modalLocator.locator('#roleIsActive');
  }

  async fillForm(name: string, isActive: boolean): Promise<void> {
    await this.nameInput.fill(name);
    if (isActive !== (await this.roleIsActiveCheckbox.isChecked())) {
      await this.roleIsActiveCheckbox.check();
    }

    if (!isActive && (await this.roleIsActiveCheckbox.isChecked())) {
      await this.roleIsActiveCheckbox.uncheck();
    }
  }

  async getValidationErrors() {
    const errors = await this.modalLocator
      .locator('.invalid-feedback').all();
    return errors;
  }
}
