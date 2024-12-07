import { Locator, Page } from '@playwright/test';
import { BaseModal } from 'e2e/common/base-modal';

export class UserModal extends BaseModal {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly roleFilterSelect: Locator;
  readonly userIsActiveCheckbox: Locator;
  readonly addRole: Locator;
  readonly editRole: Locator;

  constructor(page: Page) {
    super(page, '#usersModal');
    this.usernameInput = this.modalLocator.locator('#username');
    this.emailInput = this.modalLocator.locator('#email');
    this.roleFilterSelect = this.modalLocator.locator('#roleFilter');
    this.userIsActiveCheckbox = this.modalLocator.locator('#userIsActive');
    this.editRole = this.modalLocator.locator('.roleActions button').nth(0);
    this.addRole = this.modalLocator.locator('.roleActions button').nth(1);
  }

  async fillForm(
    username: string,
    email: string,
    role: string[],
    isActive: boolean
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);

    for (const roleName of role) {
      await this.roleFilterSelect.selectOption({ label: roleName });
      await this.clickAddRole();
    }

    if (isActive !== (await this.userIsActiveCheckbox.isChecked())) {
      await this.userIsActiveCheckbox.check();
    }

    if (!isActive && (await this.userIsActiveCheckbox.isChecked())) {
      await this.userIsActiveCheckbox.uncheck();
    }
  }

  async clickAddRole() {
    await this.addRole.click();
  }

  async clickEditRole() {
    await this.editRole.click();
  }

  async getRoleList() {
    const roleList = await this.modalLocator
      .locator('.roles span')
      .allTextContents();
    return roleList;
  }

  async getValidationErrors() {
    const errors = await this.modalLocator.locator('.invalid-feedback').all();
    return errors;
  }
}
