import { Locator, Page } from '@playwright/test';
import { BaseModal } from 'e2e/common/base-modal';

export class InviteModal extends BaseModal {
  readonly familyInput: Locator;
  readonly groupSelect: Locator;
  readonly entriesNumberInput: Locator;
  readonly contactNumberInput: Locator;
  readonly kidsAllowedCheckbox: Locator;
  readonly addNewGroupButton: Locator;
  readonly editGroupButton: Locator;
  readonly newGroupInput: Locator;
  readonly inviteGroupForm: Locator;
  readonly inviteForm: Locator;

  constructor(page: Page) {
    super(page, '#inviteModal');
    this.familyInput = this.modalLocator.locator('#family');
    this.groupSelect = this.modalLocator.locator('#inviteGroupId');
    this.entriesNumberInput = this.modalLocator.locator('#entriesNumber');
    this.contactNumberInput = this.modalLocator.locator('#phoneNumber');
    this.kidsAllowedCheckbox = this.modalLocator.locator('#kidsAllowed');
    this.addNewGroupButton = this.modalLocator
      .locator('.inviteGroupActions button')
      .nth(0);
    this.editGroupButton = this.modalLocator
      .locator('.inviteGroupActions button')
      .nth(1);
    this.newGroupInput = this.modalLocator.locator('#inviteGroup');
    this.inviteGroupForm = this.modalLocator.locator('#inviteGroupForm');
    this.inviteForm = this.modalLocator.locator('#inviteForm');
  }

  async fillInviteForm(
    family: string,
    group: string,
    entriesNumber: string,
    contactNumber: string,
    kidsAllowed: boolean
  ) {
    await this.familyInput.fill(family);
    await this.groupSelect.selectOption({ label: group });
    await this.entriesNumberInput.fill(entriesNumber);
    await this.contactNumberInput.fill(contactNumber);

    if (kidsAllowed) {
      await this.kidsAllowedCheckbox.check();
    } else {
      await this.kidsAllowedCheckbox.uncheck();
    }
  }

  async getValidationErrors() {
    const error = await this.modalLocator
      .locator('.invalid-feedback')
      .allTextContents();
    return error;
  }

  async clickAddNewGroupButton() {
    await this.addNewGroupButton.click();
  }

  async waitForGroupFormToLoad() {
    await this.inviteGroupForm.waitFor({ state: 'visible', timeout: 2000 });
  }

  async waitForInviteFormToLoad() {
    await this.inviteForm.waitFor({ state: 'visible', timeout: 2000 });
  }

  async clickEditGroupButton() {
    await this.editGroupButton.click();
  }

  async fillInviteGroupForm(group: string) {
    await this.newGroupInput.fill(group);
  }

  async getInviteGroupOptions() {
    const options = await this.groupSelect.locator('option').allTextContents();
    return options;
  }

  async getOptionSelected() {
    const options = this.groupSelect.locator('option').all();
    const optionsLabels: string[] = [];
    const optionValues: string[] = [];

    for (const option of await options) {
      optionsLabels.push((await option.textContent()) || '');
      optionValues.push((await option.getAttribute('value')) || '');
    }

    const selectedValue = await this.groupSelect.inputValue();
    const selectedOption = optionValues.findIndex(
      (option) => option == selectedValue
    );
    return optionsLabels[selectedOption];
  }
}
