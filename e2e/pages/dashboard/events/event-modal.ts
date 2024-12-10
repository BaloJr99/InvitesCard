import { Locator, Page } from '@playwright/test';
import { BaseModal } from 'e2e/common/base-modal';

export class EventModal extends BaseModal {
  readonly eventNameInput: Locator;
  readonly eventDateInput: Locator;
  readonly confirmationDeadlineInput: Locator;
  readonly typeOfEventInput: Locator;
  readonly nameOfCelebratedInput: Locator;
  readonly assignedUserInput: Locator;

  constructor(page: Page) {
    super(page, '#eventModal');

    this.eventNameInput = this.modalLocator.locator('#nameOfEvent');
    this.eventDateInput = this.modalLocator.locator('#dateOfEvent');
    this.confirmationDeadlineInput = this.modalLocator.locator(
      '#maxDateOfConfirmation'
    );
    this.typeOfEventInput = this.modalLocator.locator('#typeOfEvent');
    this.nameOfCelebratedInput = this.modalLocator.locator('#nameOfCelebrated');
    this.assignedUserInput = this.modalLocator.locator('#userId');
  }

  async fillEventForm(
    name: string,
    date: string,
    confirmationDeadline: string,
    typeOfEvent: string,
    nameOfCelebrated: string,
    assignedUser: string
  ) {
    await this.eventNameInput.fill(name);
    await this.eventDateInput.fill(date);
    await this.confirmationDeadlineInput.fill(confirmationDeadline);
    await this.typeOfEventInput.selectOption({ value: typeOfEvent });
    await this.nameOfCelebratedInput.fill(nameOfCelebrated);
    await this.assignedUserInput.selectOption({ label: assignedUser });
  }

  async setEventName(name: string) {
    await this.eventNameInput.fill(name);
  }

  async setEventDate(date: string) {
    await this.eventDateInput.fill(date);
  }

  async setConfirmationDeadline(date: string) {
    await this.confirmationDeadlineInput.fill(date);
  }

  async setTypeOfEvent(type: string) {
    await this.typeOfEventInput.selectOption({ value: type });
  }

  async setNameOfCelebrated(name: string) {
    await this.nameOfCelebratedInput.fill(name);
  }

  async setAssignedUser(user: string) {
    await this.assignedUserInput.selectOption({ label: user });
  }

  async getValidationErrors() {
    const error = await this.modalLocator
      .locator('.invalid-feedback')
      .allTextContents();
    return error;
  }
}
