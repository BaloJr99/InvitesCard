import { Locator, Page } from '@playwright/test';
import { SettingsPage } from './settings-page';

export class SweetXvSettingsPage extends SettingsPage {
  readonly primaryColorInput: Locator;
  readonly secondaryColorInput: Locator;
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

  constructor(page: Page) {
    super(page);

    // Sweet Xv settings
    this.primaryColorInput = page.locator('#primaryColor');
    this.secondaryColorInput = page.locator('#secondaryColor');
    this.firstSectionSentencesInput = page.locator('#firstSectionSentences');
    this.parentsInput = page.locator('#parents');
    this.godParentsInput = page.locator('#godParents');
    this.secondSectionSentenceInput = page.locator('#secondSectionSentences');
    this.massUrlAddressInput = page.locator('#massUrl');
    this.massTimeInput = page.locator('#massTime');
    this.massAddressInput = page.locator('#massAddress');
    this.receptionUrlAddressInput = page.locator('#receptionUrl');
    this.receptionTimeInput = page.locator('#receptionTime');
    this.receptionPlaceInput = page.locator('#receptionPlace');
    this.receptionAddressInput = page.locator('#receptionAddress');
    this.dressCodeInput = page.locator('#dressCodeColor');
  }

  async fillSweetXvSettings(
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
    await this.primaryColorInput.fill(primaryColor);
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
}
