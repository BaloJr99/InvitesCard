import test, { expect } from '@playwright/test';
import {
  invitesAdminUser,
  saveTheDateEventMock,
  sweetXvEventMock,
} from 'e2e/helper/mocks';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { DashboardPage } from 'e2e/pages/dashboard/dashboard-page';
import { EventsPage } from 'e2e/pages/dashboard/events/events-page';
import { SettingsPage } from 'e2e/pages/dashboard/settings/settings-page';
import { TestingPage } from 'e2e/pages/dashboard/testing/testing-page';
import { toLocalDate } from 'src/app/shared/utils/tools';
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
      await testingPage.clickEventsLink();

      const eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      const eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitForModalToShow();

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
      await eventsPage.waitForToast();

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

    expect(await settingsPage.filesEmptyMessage.isVisible(), {
      message: 'The select a event message should not be visible',
    }).toBe(false);
  });

  test('should be able to fill the form and save the settings', async () => {
    await settingsPage.selectEvent(sweetXvEventMock.nameOfEvent);

    const dateOfMass = sweetXvSettingMock.massTime.split(' ');
    const dateOfMassTime = dateOfMass[0];
    const timeOfMassTime = dateOfMass[1];
    const massTime = toLocalDate(`${dateOfMassTime}T${timeOfMassTime}.000Z`)
      .split('T')[1]
      .substring(0, 5);

    const dateOfReception = sweetXvSettingMock.receptionTime.split(' ');
    const dateOfReceptionTime = dateOfReception[0];
    const timeOfReceptionTime = dateOfReception[1];
    const receptionTime = toLocalDate(
      `${dateOfReceptionTime}T${timeOfReceptionTime}.000Z`
    )
      .split('T')[1]
      .substring(0, 5);

    await settingsPage.fillSweet16Settings(
      sweetXvSettingMock.primaryColor,
      sweetXvSettingMock.secondaryColor,
      sweetXvSettingMock.parents,
      sweetXvSettingMock.godParents,
      sweetXvSettingMock.firstSectionSentences,
      sweetXvSettingMock.secondSectionSentences,
      sweetXvSettingMock.massUrl,
      massTime,
      sweetXvSettingMock.massAddress,
      sweetXvSettingMock.receptionUrl,
      receptionTime,
      sweetXvSettingMock.receptionPlace,
      sweetXvSettingMock.receptionAddress,
      sweetXvSettingMock.dressCodeColor
    );

    await settingsPage.clickSaveChanges();
    await settingsPage.waitToLoad();
    await settingsPage.waitForToast();
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
      await testingPage.clickEventsLink();

      const eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();
      const eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitForModalToShow();

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
      await eventsPage.waitForToast();

      await eventsPage.clickSettingsLink();
      environmentCleaned = true;
    } else {
      const dashboardPage = (await loginPage.login(
        invitesAdminUser.username,
        invitesAdminUser.password
      )) as DashboardPage;
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

    expect(await settingsPage.filesEmptyMessage.isVisible(), {
      message: 'The select a event message should not be visible',
    }).toBe(false);
  });

  test('should be able to fill the form and save the settings', async () => {
    await settingsPage.selectEvent(saveTheDateEventMock.nameOfEvent);

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
    await settingsPage.waitForToast();
  });
});
