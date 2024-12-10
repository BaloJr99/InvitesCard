import { Locator, Page } from '@playwright/test';
import { BaseInvitesPage } from './base-invites-page';

export class SaveTheDatePage extends BaseInvitesPage {
  // Info section
  readonly backgroundImage: Locator;
  readonly namesOfCelebrated: Locator;

  // Reception section
  readonly receptionDate: Locator;
  readonly receptionPlace: Locator;
  readonly dayOfTheWeek: Locator;

  // Accordion button
  readonly accordionButton: Locator;

  // Accomodation form
  readonly yesRadio: Locator;
  readonly noRadio: Locator;
  readonly sendConfirmationButton: Locator;

  constructor(page: Page) {
    super(page);
    const infoSection = page.locator('.info');
    this.backgroundImage = infoSection.locator('.backgroundImage0');
    this.namesOfCelebrated = infoSection.locator('.header .names');

    const receptionSection = page.locator('.reception');
    this.receptionDate = receptionSection.locator('span').nth(0);
    this.receptionPlace = receptionSection.locator('span').nth(1);
    this.dayOfTheWeek = receptionSection.locator('td.dateOfEvent span');

    this.accordionButton = page.locator('.accordion-button');

    const confirmationForm = page.locator('form');
    this.yesRadio = confirmationForm.locator('input[type="radio"]').nth(0);
    this.noRadio = confirmationForm.locator('input[type="radio"]').nth(1);
    this.sendConfirmationButton = confirmationForm.locator('button');
  }

  async fillAccomodationForm(needsAccomodation: boolean): Promise<void> {
    await this.accordionButton.click();
    if (needsAccomodation) {
      await this.yesRadio.check();
    } else {
      await this.noRadio.check();
    }
  }

  async sendConfirmation() {
    await this.sendConfirmationButton.click();
  }

  async isInviteConfirmed() {
    return this.page.locator('.confirmedModal .confirmed').isVisible();
  }
}
