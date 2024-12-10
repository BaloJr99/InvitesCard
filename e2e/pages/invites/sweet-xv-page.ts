import { Locator, Page } from '@playwright/test';
import { BaseInvitesPage } from './base-invites-page';

export class SweetXvPage extends BaseInvitesPage {
  // Info section
  readonly backgroundImage: Locator;
  readonly nameOfCelebrated: Locator;
  readonly dateOfEvent: Locator;
  readonly countdown: Locator;

  // Speech section
  readonly firstSectionSentence_1: Locator;
  readonly family: Locator;
  readonly numberOfEntries: Locator;
  readonly noKids: Locator;
  readonly firstSectionSentence_2: Locator;

  // Ceremony section
  readonly father: Locator;
  readonly mother: Locator;
  readonly godFather: Locator;
  readonly godMother: Locator;
  readonly secondSectionSentence: Locator;
  readonly massTime: Locator;
  readonly massAddress: Locator;
  readonly massIframe: Locator;

  // Reception section
  readonly receptionIframe: Locator;
  readonly receptionPlace: Locator;
  readonly receptionAddress: Locator;
  readonly receptionTime: Locator;

  // Dress code section
  readonly dressCodeColor: Locator;

  // Gifts section
  readonly giftsSection: Locator;

  // Confirmation form
  readonly yesRadio: Locator;
  readonly noRadio: Locator;
  readonly entriesConfirmedSelect: Locator;
  readonly messageInput: Locator;
  readonly sendConfirmationButton: Locator;

  constructor(page: Page) {
    super(page);
    const infoSection = page.locator('.info');
    this.backgroundImage = infoSection.locator('.backgroundImage0');
    this.nameOfCelebrated = infoSection.locator('.header p');
    this.dateOfEvent = infoSection.locator('.date p');
    this.countdown = infoSection.locator('.time');

    const speechSection = page.locator('.speech');
    this.firstSectionSentence_1 = speechSection.locator('p').first();
    this.family = speechSection.locator('p').nth(1);
    this.numberOfEntries = speechSection.locator('p').nth(2);
    this.noKids = speechSection.locator('.noKids');
    this.firstSectionSentence_2 = speechSection.locator('p').last();

    const ceremonySection = page.locator('.ceremony');
    this.father = ceremonySection.locator('p').nth(1);
    this.mother = ceremonySection.locator('p').nth(2);
    this.godFather = ceremonySection.locator('p').nth(4);
    this.godMother = ceremonySection.locator('p').nth(5);
    this.secondSectionSentence = ceremonySection.locator('p').nth(6);
    this.massTime = ceremonySection.locator('p').nth(7);
    this.massAddress = ceremonySection.locator('p').nth(8);
    this.massIframe = ceremonySection.locator('iframe');

    const receptionSection = page.locator('.reception');
    this.receptionIframe = receptionSection.locator('iframe');
    this.receptionPlace = receptionSection.locator('h3');
    this.receptionAddress = receptionSection.locator('p');
    this.receptionTime = receptionSection.locator('span');

    const dressCodeSection = page.locator('.dressCode');
    this.dressCodeColor = dressCodeSection.locator('p').nth(2);

    this.giftsSection = page.locator('.gifts');

    const confirmationForm = page.locator('form');
    this.yesRadio = confirmationForm.locator('input[type="radio"]').nth(0);
    this.noRadio = confirmationForm.locator('input[type="radio"]').nth(1);
    this.entriesConfirmedSelect = confirmationForm.locator('select');
    this.messageInput = confirmationForm.locator('textarea');
    this.sendConfirmationButton = confirmationForm.locator('button');
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
