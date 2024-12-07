import { expect, Locator, Page } from '@playwright/test';
import { uploadFilesPath } from 'e2e/helper/upload-files';
import { DashboardPage } from '../dashboard-page';
import { CommonModal } from 'e2e/common/common-modal';

export class FilesPage extends DashboardPage {
  readonly breadcrumb: Locator;
  readonly eventSelect: Locator;
  readonly filesEmptyMessage: Locator;
  readonly photosInput: Locator;
  readonly audioInput: Locator;
  readonly saveFilesButton: Locator;
  readonly imageContainer: Locator;
  readonly audioContainer: Locator;
  readonly showImage: Locator;
  readonly saveChanges: Locator;
  readonly cancelChanges: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumb = page.locator('.breadcrumb-header li', {
      hasText: 'FILES',
    });

    this.eventSelect = page.locator('#event-select');
    this.filesEmptyMessage = page.locator('.files-empty');
    this.photosInput = page.locator('#photoFiles');
    this.audioInput = page.locator('#musicFiles');
    this.saveFilesButton = page.locator('.upload-form button');

    this.imageContainer = page.locator('.image-container');
    this.audioContainer = page.locator('.music-container');

    this.showImage = page.locator('.show-image');

    this.saveChanges = page.locator('#save-changes');
    this.cancelChanges = page.locator('#cancel-changes');
  }

  override async goto() {
    await super.goto('/dashboard/files');
    await this.isFilesPage();
  }

  async isFilesPage() {
    expect(this.breadcrumb, {
      message: 'Files breadcrumb should be visible',
    }).toBeVisible();
  }

  async selectEvent(event: string) {
    return this.eventSelect.selectOption({ label: event });
  }

  async uploadPhotos() {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.photosInput.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(uploadFilesPath('test.png'));
  }

  async uploadAudio() {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.audioInput.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(uploadFilesPath('test.mp3'));
  }

  async clickSaveFiles() {
    await this.saveFilesButton.click();
  }

  async imageContainerVisible() {
    return this.imageContainer.isVisible();
  }

  async audioContainerVisible() {
    return this.audioContainer.isVisible();
  }

  async showImageVisible() {
    return this.showImage.isVisible();
  }

  async getImageCard(index: number) {
    this.imageContainer.scrollIntoViewIfNeeded();
    return this.imageContainer.locator('.card').nth(index);
  }

  async getImageCardCount(): Promise<number> {
    if (await this.imageContainer.isVisible()) {
      this.imageContainer.scrollIntoViewIfNeeded();
      return this.imageContainer.locator('.card').count();
    }
    return 0;
  }

  async getAudioCard(index: number) {
    this.audioContainer.scrollIntoViewIfNeeded();
    return this.audioContainer.locator('.card').nth(index);
  }

  async getAudioCardCount(): Promise<number> {
    if (await this.audioContainer.isVisible()) {
      this.audioContainer.scrollIntoViewIfNeeded();
      return this.audioContainer.locator('.card').count();
    }
    return 0;
  }

  async clickScaleImage(index: number) {
    const imageCard = await this.getImageCard(index);
    const scaleButton = imageCard.locator('.image-controls button');
    await scaleButton.click();
  }

  async selectImageUsage(index: number, usage: string) {
    const imageCard = await this.getImageCard(index);
    const usageSelect = imageCard.locator('select');
    await usageSelect.selectOption({ value: usage });
  }

  async deleteImage(index: number) {
    const imageCard = await this.getImageCard(index);
    const deleteButton = imageCard.locator('.controls button');
    await deleteButton.click();

    return new CommonModal(this.page);
  }

  async deleteAudio(index: number) {
    const audioCard = await this.getAudioCard(index);
    const deleteButton = audioCard.locator('.audio-controls button');
    await deleteButton.click();

    return new CommonModal(this.page);
  }

  async clickSaveChanges() {
    await this.saveChanges.click();
  }

  async clickCancelChanges() {
    await this.cancelChanges.click();
  }
}
