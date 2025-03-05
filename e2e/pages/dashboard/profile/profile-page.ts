import { expect, Locator, Page } from '@playwright/test';
import { DashboardPage } from '../dashboard-page';
import { ProfileModal } from './profile-modal/profile-modal';

export class ProfilePage extends DashboardPage {
  readonly breadcrumbHeader: Locator;
  readonly profileImageIcon: Locator;
  readonly profileImage: Locator;
  readonly addProfileImage: Locator;
  readonly profileFullName: Locator;
  readonly profileEmail: Locator;
  readonly changePasswordButton: Locator;
  readonly profileNameInput: Locator;
  readonly profileLastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly genderSelect: Locator;
  readonly emailInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly changePasswordCard: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly resetPasswordButton: Locator;
  readonly cancelResetPasswordButton: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbHeader = page.locator('.breadcrumb-header li', {
      hasText: 'PROFILE',
    });

    this.profileImageIcon = page.locator('.profile-image i');
    this.profileImage = page.locator('.profile-image img');
    this.addProfileImage = page.locator('.profile-image button');
    this.profileFullName = page.locator('.profile-name');
    this.profileEmail = page.locator('.profile-email');
    this.changePasswordButton = page.locator('.profile-info button');

    this.profileNameInput = page.locator('#firstName');
    this.profileLastNameInput = page.locator('#lastName');
    this.usernameInput = page.locator('#username');
    this.genderSelect = page.locator('#gender');
    this.emailInput = page.locator('#email');
    this.phoneNumberInput = page.locator('#phoneNumber');
    this.saveButton = page.locator('button', { hasText: 'Save changes' });
    this.cancelButton = page.locator('button', { hasText: 'Cancel changes' });

    this.changePasswordCard = page.locator('#changePassword');
    this.passwordInput = this.changePasswordCard.locator('#password');
    this.confirmPasswordInput =
      this.changePasswordCard.locator('#confirmPassword');
    this.resetPasswordButton = this.changePasswordCard.locator('button', {
      hasText: 'Reset',
    });
    this.cancelResetPasswordButton = this.changePasswordCard.locator('button', {
      hasText: 'Cancel',
    });
  }

  async isProfilePage() {
    await this.breadcrumbHeader.waitFor({ state: 'visible', timeout: 5000 });
    expect(this.breadcrumbHeader, {
      message: 'Profile breadcrumb should be visible',
    }).toBeVisible();
  }

  async isProfileIconVisible() {
    return this.profileImageIcon.isVisible();
  }

  async isProfileImageVisible() {
    return this.profileImage.isVisible();
  }

  async clickAddProfileImage() {
    await this.addProfileImage.click();
    return new ProfileModal(this.page);
  }

  async getProfileFullName() {
    return this.profileFullName.textContent();
  }

  async getProfileEmail() {
    return this.profileEmail.textContent();
  }

  async clickChangePassword() {
    await this.changePasswordButton.click();
  }

  async fillProfileInfo(
    profileName: string,
    profileLastName: string,
    username: string,
    gender: string,
    email: string,
    phoneNumber: string
  ) {
    await this.profileNameInput.fill(profileName);
    await this.profileLastNameInput.fill(profileLastName);
    await this.usernameInput.fill(username);
    await this.genderSelect.selectOption({ value: gender });
    await this.emailInput.fill(email);
    await this.phoneNumberInput.fill(phoneNumber);
  }

  async clickSaveChanges() {
    await this.saveButton.click();
  }

  async clickCancelChanges() {
    await this.cancelButton.click();
  }

  async getValidationErrors() {
    const errors = await this.page
      .locator('.invalid-feedback')
      .allTextContents();
    return errors;
  }

  async isChangePasswordCardVisible() {
    return this.changePasswordCard.isVisible();
  }

  async fillChangePassword(password: string, confirmPassword: string) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async clickResetPassword() {
    await this.resetPasswordButton.click();
  }

  async clickCancelResetPassword() {
    await this.cancelResetPasswordButton.click();
  }
}
