import test, { expect } from '@playwright/test';
import {
  invitesAdminUser,
  saveTheDateEventMock,
  sweetXvEventMock,
} from 'e2e/helper/mocks';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { EventsPage } from 'e2e/pages/dashboard/events/events-page';
import { SettingsPage } from 'e2e/pages/dashboard/settings/settings-page';
import { TestingPage } from 'e2e/pages/dashboard/testing/testing-page';
import {
  saveTheDateSettingMock,
  sweetXvSettingMock,
} from 'src/tests/mocks/mocks';

test.describe('Dashboard settings (Sweet 16)', () => {
  let environmentCleaned = false;
  let settingsPage: SettingsPage;

  // Login as admin before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();

    // Clean environment and create a new event
    if (!environmentCleaned) {
      await dashboardPage.clickTestingLink();
      const testingPage = new TestingPage(page);
      await testingPage.clickCleanEnvironmentButton();
      await testingPage.waitToLoad();

      await testingPage.clickEventsLink();

      const eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();
      const eventModal = await eventsPage.clickNewEventButton();
      await eventsPage.waitToLoad();

      await eventModal.fillEventForm(
        sweetXvEventMock.nameOfEvent,
        sweetXvEventMock.dateOfEvent,
        sweetXvEventMock.maxDateOfConfirmation,
        sweetXvEventMock.typeOfEvent,
        sweetXvEventMock.nameOfCelebrated,
        sweetXvEventMock.assignedUser
      );

      await eventModal.clickConfirmButton();
      await eventsPage.waitToLoad();
      expect(await eventsPage.toastrIsShowing()).toBe(true);

      await eventsPage.clickSettingsLink();
      environmentCleaned = true;
    } else {
      await dashboardPage.clickSettingsLink();
    }

    settingsPage = new SettingsPage(page);
    await settingsPage.waitToLoad();
  });

  test('should show the select a event message when no event is selected', async () => {
    expect(await settingsPage.filesEmptyMessage.isVisible(), {
      message: 'The select a event message should be visible',
    }).toBe(true);

    await settingsPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await settingsPage.waitToLoad();

    expect(await settingsPage.filesEmptyMessage.isVisible(), {
      message: 'The select a event message should not be visible',
    }).toBe(false);
  });

  test('should show validation errors when saving with empty fields', async () => {
    await settingsPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await settingsPage.waitToLoad();
    await settingsPage.clickSaveChanges();

    const expectedErrors = [
      'The primary color is required',
      'The secondary color is required',
      'The name of the parents is required',
      'The name of the godparents is required',
      'The first section phrases are required',
      'The second section phrase is required',
      'The mass url address is required',
      'The mass time is required',
      'The mass address is required',
      'The mass url address is required',
      'The reception time is required',
      'The reception place is required',
      'The reception address is required',
      'The color restriction is required',
    ];
    const errors = await settingsPage.getValidationErrors();
    errors.forEach((error, index) => {
      expect(error).toContain(expectedErrors[index]);
    });
  });

  test('should be able to fill the form and save the settings', async () => {
    await settingsPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await settingsPage.waitToLoad();

    await settingsPage.fillSweet16Settings(
      sweetXvSettingMock.primaryColor,
      sweetXvSettingMock.secondaryColor,
      sweetXvSettingMock.parents,
      sweetXvSettingMock.godParents,
      sweetXvSettingMock.firstSectionSentences,
      sweetXvSettingMock.secondSectionSentences,
      sweetXvSettingMock.massUrl,
      sweetXvSettingMock.massTime,
      sweetXvSettingMock.massAddress,
      sweetXvSettingMock.receptionUrl,
      sweetXvSettingMock.receptionTime,
      sweetXvSettingMock.receptionPlace,
      sweetXvSettingMock.receptionAddress,
      sweetXvSettingMock.dressCodeColor
    );

    await settingsPage.clickSaveChanges();
    await settingsPage.waitToLoad();

    expect(await settingsPage.toastrIsShowing()).toBe(true);
  });
});

test.describe('Dashboard settings (Save the date)', () => {
  let environmentCleaned = false;
  let settingsPage: SettingsPage;

  // Login as admin before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Clean environment and create a new event
    if (!environmentCleaned) {
      const dashboardPage = await loginPage.loginAsAdmin();
      await dashboardPage.waitToLoad();
      await dashboardPage.clickTestingLink();
      const testingPage = new TestingPage(page);
      await testingPage.clickCleanEnvironmentButton();
      await testingPage.waitToLoad();

      await testingPage.clickEventsLink();

      const eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();
      const eventModal = await eventsPage.clickNewEventButton();
      await eventsPage.waitToLoad();

      await eventModal.fillEventForm(
        saveTheDateEventMock.nameOfEvent,
        saveTheDateEventMock.dateOfEvent,
        saveTheDateEventMock.maxDateOfConfirmation,
        saveTheDateEventMock.typeOfEvent,
        saveTheDateEventMock.nameOfCelebrated,
        saveTheDateEventMock.assignedUser
      );

      await eventModal.clickConfirmButton();
      await eventsPage.waitToLoad();
      expect(await eventsPage.toastrIsShowing()).toBe(true);

      await eventsPage.clickSettingsLink();
      environmentCleaned = true;
    } else {
      const dashboardPage = await loginPage.login(
        invitesAdminUser.username,
        invitesAdminUser.password
      );
      await dashboardPage.waitToLoad();
      await dashboardPage.clickSettingsLink();
    }

    settingsPage = new SettingsPage(page);
    await settingsPage.waitToLoad();
  });

  test('should show the select a event message when no event is selected', async () => {
    expect(await settingsPage.filesEmptyMessage.isVisible(), {
      message: 'The select a event message should be visible',
    }).toBe(true);

    await settingsPage.selectEvent(saveTheDateEventMock.nameOfEvent);
    await settingsPage.waitToLoad();

    expect(await settingsPage.filesEmptyMessage.isVisible(), {
      message: 'The select a event message should not be visible',
    }).toBe(false);
  });

  test('should show validation errors when saving with empty fields', async () => {
    await settingsPage.selectEvent(saveTheDateEventMock.nameOfEvent);
    await settingsPage.waitToLoad();
    await settingsPage.clickSaveChanges();

    const expectedErrors = [
      'The primary color is required',
      'The secondary color is required',
      'The event venue is required',
      'The copy message is required',
      'The hotel name is required',
      'The url with information of the hotel is required',
    ];
    const errors = await settingsPage.getValidationErrors();
    errors.forEach((error, index) => {
      expect(error).toContain(expectedErrors[index]);
    });
  });

  test('should be able to fill the form and save the settings', async () => {
    await settingsPage.selectEvent(saveTheDateEventMock.nameOfEvent);
    await settingsPage.waitToLoad();

    await settingsPage.fillSaveTheDateSettings(
      saveTheDateSettingMock.primaryColor,
      saveTheDateSettingMock.secondaryColor,
      saveTheDateSettingMock.receptionPlace,
      saveTheDateSettingMock.copyMessage,
      saveTheDateSettingMock.hotelName,
      saveTheDateSettingMock.hotelInformation
    );

    await settingsPage.clickSaveChanges();
    await settingsPage.waitToLoad();

    expect(await settingsPage.toastrIsShowing()).toBe(true);
  });
});
