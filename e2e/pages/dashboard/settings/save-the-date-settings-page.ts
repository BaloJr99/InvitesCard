import { Locator, Page } from '@playwright/test';
import { SettingsPage } from './settings-page';

export class SaveTheDateSettingsPage extends SettingsPage {
  readonly primaryColorInput: Locator;
  readonly secondaryColorInput: Locator;
  readonly eventVenueInput: Locator;
  readonly copyMessageInput: Locator;
  readonly hotelNameInput: Locator;
  readonly hotelUrlInput: Locator;

  constructor(page: Page) {
    super(page);

    // Save The Date settings
    this.primaryColorInput = page.locator('#primaryColor');
    this.secondaryColorInput = page.locator('#secondaryColor');
    this.eventVenueInput = page.locator('#receptionPlace');
    this.copyMessageInput = page.locator('#copyMessage');
    this.hotelNameInput = page.locator('#hotelName');
    this.hotelUrlInput = page.locator('#hotelInformation');
  }

  async fillSaveTheDateSettings(
    primaryColor: string,
    secondaryColor: string,
    eventVenue: string,
    copyMessage: string,
    hotelName: string,
    hotelUrl: string
  ) {
    await this.primaryColorInput.fill(primaryColor);
    await this.secondaryColorInput.fill(secondaryColor);
    await this.eventVenueInput.fill(eventVenue);
    await this.copyMessageInput.fill(copyMessage);
    await this.hotelNameInput.fill(hotelName);
    await this.hotelUrlInput.fill(hotelUrl);
  }
}
