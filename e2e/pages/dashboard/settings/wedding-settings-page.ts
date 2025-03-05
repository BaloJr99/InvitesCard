import { Locator, Page } from '@playwright/test';
import { SettingsPage } from './settings-page';

export class WeddingSettingsPage extends SettingsPage {
  // Sections
  readonly infoSection: Locator;
  readonly itinerarySection: Locator;
  readonly dressCodeSection: Locator;
  readonly giftsSection: Locator;
  readonly accomodationSection: Locator;

  // Section checkboxes
  readonly itinerarySectionCheckbox: Locator;
  readonly dressCodeSectionCheckbox: Locator;
  readonly giftsSectionCheckbox: Locator;

  // Invite information section
  readonly primaryColorInput: Locator;
  readonly secondaryColorInput: Locator;
  readonly copyMessageInput: Locator;
  readonly groomParentsInput: Locator;
  readonly brideParentsInput: Locator;

  // Itinerary section
  readonly massUrlAddressInput: Locator;
  readonly massTimeInput: Locator;
  readonly massAddressInput: Locator;
  readonly civilUrlAddressInput: Locator;
  readonly civilTimeInput: Locator;
  readonly civilPlaceInput: Locator;
  readonly venueUrlAddressInput: Locator;
  readonly venueTimeInput: Locator;
  readonly venuePlaceInput: Locator;

  // Dress code section
  readonly dressCodeInput: Locator;

  // Gifts section
  readonly cardNumberInput: Locator;
  readonly CLABEInput: Locator;

  // Accomodation section
  readonly hotelUrlAddressInput: Locator;
  readonly hotelPhoneNumberInput: Locator;
  readonly hotelAddressInput: Locator;

  constructor(page: Page) {
    super(page);
    // Sections
    this.infoSection = page.locator('.info');
    this.itinerarySection = page.locator('.itinerary');
    this.dressCodeSection = page.locator('.dressCode');
    this.giftsSection = page.locator('.gifts');
    this.accomodationSection = page.locator('.accomodation');

    // Section checkboxes
    this.itinerarySectionCheckbox = page.locator('#input-itineraryInfo');
    this.dressCodeSectionCheckbox = page.locator('#input-dressCodeInfo');
    this.giftsSectionCheckbox = page.locator('#input-giftsInfo');

    // Save The Date settings
    this.primaryColorInput = page.locator('#weddingPrimaryColor');
    this.secondaryColorInput = page.locator('#weddingSecondaryColor');
    this.copyMessageInput = page.locator('#weddingCopyMessage');
    this.groomParentsInput = page.locator('#groomParents');
    this.brideParentsInput = page.locator('#brideParents');

    // Itinerary section
    this.massUrlAddressInput = page.locator('#massUrl');
    this.massTimeInput = page.locator('#massTime');
    this.massAddressInput = page.locator('#massPlace');
    this.civilUrlAddressInput = page.locator('#civilUrl');
    this.civilTimeInput = page.locator('#civilTime');
    this.civilPlaceInput = page.locator('#civilPlace');
    this.venueUrlAddressInput = page.locator('#venueUrl');
    this.venueTimeInput = page.locator('#venueTime');
    this.venuePlaceInput = page.locator('#venuePlace');

    // Dress code section
    this.dressCodeInput = page.locator('#dressCodeColor');

    // Gifts section
    this.cardNumberInput = page.locator('#cardNumber');
    this.CLABEInput = page.locator('#clabeBank');

    // Accomodation section
    this.hotelUrlAddressInput = page.locator('#hotelUrl');
    this.hotelPhoneNumberInput = page.locator('#hotelPhone');
    this.hotelAddressInput = page.locator('#hotelAddress');
  }

  async fillInviteInformationSection(
    primaryColor: string,
    secondaryColor: string,
    copyMessage: string,
    groomParents: string,
    brideParents: string
  ) {
    await this.primaryColorInput.fill(primaryColor);
    await this.secondaryColorInput.fill(secondaryColor);
    await this.copyMessageInput.fill(copyMessage);
    await this.groomParentsInput.fill(groomParents);
    await this.brideParentsInput.fill(brideParents);
  }

  async fillItinerarySection(
    massUrlAddress: string,
    massTime: string,
    massAddress: string,
    civilUrlAddress: string,
    civilTime: string,
    civilPlace: string,
    venueUrlAddress: string,
    venueTime: string,
    venuePlace: string
  ) {
    await this.massUrlAddressInput.fill(massUrlAddress);
    await this.massTimeInput.fill(massTime);
    await this.massAddressInput.fill(massAddress);
    await this.civilUrlAddressInput.fill(civilUrlAddress);
    await this.civilTimeInput.fill(civilTime);
    await this.civilPlaceInput.fill(civilPlace);
    await this.venueUrlAddressInput.fill(venueUrlAddress);
    await this.venueTimeInput.fill(venueTime);
    await this.venuePlaceInput.fill(venuePlace);
  }

  async fillDressCodeSection(dressCode: string) {
    await this.dressCodeInput.fill(dressCode);
  }

  async fillGiftsSection(cardNumber: string, CLABE: string) {
    await this.cardNumberInput.fill(cardNumber);
    await this.CLABEInput.fill(CLABE);
  }

  async fillAccomodationSection(
    hotelUrlAddress: string,
    hotelPhoneNumber: string,
    hotelAddress: string
  ) {
    await this.hotelUrlAddressInput.fill(hotelUrlAddress);
    await this.hotelPhoneNumberInput.fill(hotelPhoneNumber);
    await this.hotelAddressInput.fill(hotelAddress);
  }

  async isInfoSectionVisible() {
    return this.infoSection.isVisible();
  }

  async isItinerarySectionVisible() {
    return this.itinerarySection.isVisible();
  }

  async isDressCodeSectionVisible() {
    return this.dressCodeSection.isVisible();
  }

  async isGiftsSectionVisible() {
    return this.giftsSection.isVisible();
  }

  async isAccomodationSectionVisible() {
    return this.accomodationSection.isVisible();
  }

  async clickItinerarySectionCheckbox(check: boolean) {
    if (check) {
      await this.itinerarySectionCheckbox.check();
    } else {
      await this.itinerarySectionCheckbox.uncheck();
    }
  }

  async clickDressCodeSectionCheckbox(check: boolean) {
    if (check) {
      await this.dressCodeSectionCheckbox.check();
    } else {
      await this.dressCodeSectionCheckbox.uncheck();
    }
  }

  async clickGiftsSectionCheckbox(check: boolean) {
    if (check) {
      await this.giftsSectionCheckbox.check();
    } else {
      await this.giftsSectionCheckbox.uncheck();
    }
  }
}
