import { Locator, Page } from '@playwright/test';
import { BaseInvitesPage } from './base-invites-page';

export class WeddingPage extends BaseInvitesPage {
  // Sections
  readonly infoSection: Locator;
  readonly speechSection: Locator;
  readonly itinerarySection: Locator;
  readonly dressCodeSection: Locator;
  readonly giftsSection: Locator;
  readonly accomodationSection: Locator;
  readonly gallerySection: Locator;
  readonly confirmationFormSection: Locator;

  // Info section
  readonly backgroundImage: Locator;
  readonly nameOfCelebrated: Locator;
  readonly dateOfEvent: Locator;
  readonly countdown: Locator;

  // Invite information section
  readonly family: Locator;
  readonly groomParents: Locator;
  readonly brideParents: Locator;
  readonly noKids: Locator;

  // Itinerary section
  readonly massUrlAddress: Locator;
  readonly massTime: Locator;
  readonly massAddress: Locator;
  readonly civilUrlAddress: Locator;
  readonly civilTime: Locator;
  readonly civilPlace: Locator;
  readonly venueUrlAddress: Locator;
  readonly venueTime: Locator;
  readonly venuePlace: Locator;

  // Dress code section
  readonly dressCode: Locator;

  // Gifts section
  readonly cardNumber: Locator;
  readonly CLABE: Locator;

  // Accomodation section
  readonly hotelUrlAddress: Locator;
  readonly hotelPhoneNumber: Locator;
  readonly hotelAddress: Locator;

  // Confirmation form
  readonly yesRadio: Locator;
  readonly noRadio: Locator;
  readonly entriesConfirmedSelect: Locator;
  readonly messageInput: Locator;
  readonly sendConfirmationButton: Locator;

  constructor(page: Page) {
    super(page);
    this.infoSection = page.locator('.info.invite-section');
    this.backgroundImage = this.infoSection.locator('.backgroundImage');
    this.nameOfCelebrated = this.infoSection.locator('.header h2');
    this.dateOfEvent = this.infoSection.locator('.date p');
    this.countdown = this.infoSection.locator('.time');

    this.speechSection = page.locator('.speech.invite-section');
    this.family = this.speechSection.locator('.familyName');
    this.brideParents = this.speechSection.locator('.col-sm-12 p');
    this.groomParents = this.speechSection.locator('.col-sm-12 p');
    this.noKids = this.speechSection.locator('.noKids');

    this.itinerarySection = page.locator('.itinerary.invite-section');

    const massBox = this.itinerarySection.locator('.box').nth(0);
    this.massUrlAddress = massBox.locator('a');
    this.massTime = massBox.locator('p').first();
    this.massAddress = massBox.locator('p').nth(1);

    const civilBox = this.itinerarySection.locator('.box').nth(1);
    this.civilUrlAddress = civilBox.locator('a');
    this.civilTime = civilBox.locator('p').first();
    this.civilPlace = civilBox.locator('p').nth(1);

    const venueBox = this.itinerarySection.locator('.box').nth(2);
    this.venueUrlAddress = venueBox.locator('a');
    this.venueTime = venueBox.locator('p').first();
    this.venuePlace = venueBox.locator('p').nth(1);

    this.dressCodeSection = page.locator('.dressCode.invite-section');
    this.dressCode = this.dressCodeSection.locator('p.pt-5');

    this.giftsSection = page.locator('.gifts.invite-section');
    this.CLABE = this.giftsSection.locator('p').nth(3);
    this.cardNumber = this.giftsSection.locator('p').nth(5);

    this.accomodationSection = page.locator('.accomodations.invite-section');
    this.hotelUrlAddress = this.accomodationSection.locator('a').first();
    this.hotelAddress = this.accomodationSection.locator('p').first();
    this.hotelPhoneNumber = this.accomodationSection.locator('p').nth(1);

    this.gallerySection = page.locator('.gallery.invite-section');

    this.confirmationFormSection = page.locator(
      '.invitesConfirmation.invite-section'
    );
    this.yesRadio = this.confirmationFormSection
      .locator('input[type="radio"]')
      .nth(0);
    this.noRadio = this.confirmationFormSection
      .locator('input[type="radio"]')
      .nth(1);
    this.entriesConfirmedSelect =
      this.confirmationFormSection.locator('select');
    this.messageInput = this.confirmationFormSection.locator('textarea');
    this.sendConfirmationButton =
      this.confirmationFormSection.locator('button');
  }

  async fillConfirmationForm(
    assistanceConfirmed: boolean,
    entriesConfirmed: string | null,
    message: string
  ): Promise<void> {
    if (assistanceConfirmed) {
      await this.yesRadio.check();
    } else {
      await this.noRadio.check();
    }

    if (entriesConfirmed) {
      await this.entriesConfirmedSelect.selectOption({
        label: entriesConfirmed,
      });
    }
    await this.messageInput.fill(message);
  }

  async sendConfirmation() {
    await this.sendConfirmationButton.click();
  }

  async isInviteConfirmed() {
    return this.page.locator('.confirmedModal .confirmed').isVisible();
  }

  async isInviteNotConfirmed() {
    return this.page.locator('.confirmedModal .not-confirmed').isVisible();
  }
}
