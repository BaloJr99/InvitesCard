import { expect, Locator, Page } from '@playwright/test';
import { DashboardPage } from '../dashboard-page';

export class SettingsPage extends DashboardPage {
  readonly breadcrumbHeader: Locator;
  readonly eventSelect: Locator;
  readonly filesEmptyMessage: Locator;
  readonly mainColorInput: Locator;
  readonly secondaryColorInput: Locator;
  readonly eventVenueInput: Locator;
  readonly copyMessageInput: Locator;
  readonly hotelNameInput: Locator;
  readonly hotelUrlInput: Locator;
  readonly parentsInput: Locator;
  readonly godParentsInput: Locator;
  readonly firstSectionSentencesInput: Locator;
  readonly secondSectionSentenceInput: Locator;
  readonly massUrlAddressInput: Locator;
  readonly massTimeInput: Locator;
  readonly massAddressInput: Locator;
  readonly receptionUrlAddressInput: Locator;
  readonly receptionTimeInput: Locator;
  readonly receptionPlaceInput: Locator;
  readonly receptionAddressInput: Locator;
  readonly dressCodeInput: Locator;
  readonly saveChangesButton: Locator;
  readonly cancelChangesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbHeader = page.locator('.breadcrumb-header li', {
      hasText: 'SETTINGS',
    });
    this.eventSelect = page.locator('#event-select');
    this.filesEmptyMessage = page.locator('.files-empty p');

    // Common settings
    this.mainColorInput = page.locator('#primaryColor');
    this.secondaryColorInput = page.locator('#secondaryColor');
    this.eventVenueInput = page.locator('#receptionPlace');
    this.copyMessageInput = page.locator('#copyMessage');

    // Save the date settings
    this.hotelNameInput = page.locator('#hotelName');
    this.hotelUrlInput = page.locator('#hotelInformation');

    // Sweet 16 settings
    this.parentsInput = page.locator('#parents');
    this.godParentsInput = page.locator('#godParents');
    this.firstSectionSentencesInput = page.locator('#firstSectionSentences');
    this.secondSectionSentenceInput = page.locator('#secondSectionSentences');
    this.massUrlAddressInput = page.locator('#massUrl');
    this.massTimeInput = page.locator('#massTime');
    this.massAddressInput = page.locator('#massAddress');
    this.receptionUrlAddressInput = page.locator('#receptionUrl');
    this.receptionTimeInput = page.locator('#receptionTime');
    this.receptionPlaceInput = page.locator('#receptionPlace');
    this.receptionAddressInput = page.locator('#receptionAddress');
    this.dressCodeInput = page.locator('#dressCodeColor');

    this.saveChangesButton = page.locator('button', {
      hasText: 'Save changes',
    });
    this.cancelChangesButton = page.locator('button', {
      hasText: 'Cancel changes',
    });
  }

  async isSettingsPage() {
    await this.breadcrumbHeader.waitFor({ state: 'visible', timeout: 2000 });
    expect(this.breadcrumbHeader, {
      message: 'Settings breadcrumb should be visible',
    }).toBeVisible();
  }

  async selectEvent(event: string) {
    await this.eventSelect.selectOption({ label: event });
    await this.waitToLoad();
  }

  async fillSaveTheDateSettings(
    primaryColor: string,
    secondaryColor: string,
    eventVenue: string,
    copyMessage: string,
    hotelName: string,
    hotelUrl: string
  ) {
    await this.mainColorInput.fill(primaryColor);
    await this.secondaryColorInput.fill(secondaryColor);
    await this.eventVenueInput.fill(eventVenue);
    await this.copyMessageInput.fill(copyMessage);
    await this.hotelNameInput.fill(hotelName);
    await this.hotelUrlInput.fill(hotelUrl);
  }

  async fillSweet16Settings(
    primaryColor: string,
    secondaryColor: string,
    parents: string,
    godParents: string,
    firstSectionSentences: string,
    secondSectionSentence: string,
    massUrlAddress: string,
    massTime: string,
    massAddress: string,
    receptionUrlAddress: string,
    receptionTime: string,
    receptionPlace: string,
    receptionAddress: string,
    dressCode: string
  ) {
    await this.mainColorInput.fill(primaryColor);
    await this.secondaryColorInput.fill(secondaryColor);
    await this.parentsInput.fill(parents);
    await this.godParentsInput.fill(godParents);
    await this.firstSectionSentencesInput.fill(firstSectionSentences);
    await this.secondSectionSentenceInput.fill(secondSectionSentence);
    await this.massUrlAddressInput.fill(massUrlAddress);
    await this.massTimeInput.fill(massTime);
    await this.massAddressInput.fill(massAddress);
    await this.receptionUrlAddressInput.fill(receptionUrlAddress);
    await this.receptionTimeInput.fill(receptionTime);
    await this.receptionPlaceInput.fill(receptionPlace);
    await this.receptionAddressInput.fill(receptionAddress);
    await this.dressCodeInput.fill(dressCode);
  }

  async clickSaveChanges() {
    await this.saveChangesButton.click();
    await this.waitToLoad();
    await this.waitForToast();
  }

  async clickCancelChanges() {
    await this.cancelChangesButton.click();
  }

  async getValidationErrors() {
    const errors = await this.page
      .locator('.invalid-feedback')
      .allTextContents();
    return errors;
  }
}
