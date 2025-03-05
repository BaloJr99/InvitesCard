import test, { expect } from '@playwright/test';
import {
  invitesAdminUser,
  saveTheDateEventMock,
  sweetXvEventMock,
} from 'e2e/helper/mocks';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { DashboardPage } from 'e2e/pages/dashboard/dashboard-page';
import { EventsPage } from 'e2e/pages/dashboard/events/events-page';
import { SaveTheDateSettingsPage } from 'e2e/pages/dashboard/settings/save-the-date-settings-page';
import { SweetXvSettingsPage } from 'e2e/pages/dashboard/settings/sweet-xv-settings-page';
import { WeddingSettingsPage } from 'e2e/pages/dashboard/settings/wedding-settings-page';
import { TestingPage } from 'e2e/pages/dashboard/testing/testing-page';
import { EventType } from 'src/app/core/models/enum';
import { toLocalDate } from 'src/app/shared/utils/tools';
import {
  saveTheDateSettingMock,
  sweetXvSettingMock,
  weddingSettingMock,
} from 'src/tests/mocks/mocks';

test.describe('Dashboard settings (Sweet Xv)', () => {
  let environmentCleaned = false;
  let settingsPage: SweetXvSettingsPage;

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

    settingsPage = new SweetXvSettingsPage(page);
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
    const massTime = toLocalDate(`${dateOfMass[0]}T${dateOfMass[1]}.000Z`)
      .split('T')[1]
      .substring(0, 5);

    const dateOfReception = sweetXvSettingMock.receptionTime.split(' ');
    const receptionTime = toLocalDate(
      `${dateOfReception[0]}T${dateOfReception[1]}.000Z`
    )
      .split('T')[1]
      .substring(0, 5);

    await settingsPage.fillSweetXvSettings(
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
  let settingsPage: SaveTheDateSettingsPage;

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

    settingsPage = new SaveTheDateSettingsPage(page);
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

test.describe('Dashboard settings (Wedding)', () => {
  let environmentCleaned = false;
  let settingsPage: WeddingSettingsPage;

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

      let eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();
      let eventModal = await eventsPage.clickNewEventButton();
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
      const saveTheDateSettings = new SaveTheDateSettingsPage(page);
      await saveTheDateSettings.waitToLoad();

      await saveTheDateSettings.selectEvent(saveTheDateEventMock.nameOfEvent);

      await saveTheDateSettings.fillSaveTheDateSettings(
        saveTheDateSettingMock.primaryColor,
        saveTheDateSettingMock.secondaryColor,
        saveTheDateSettingMock.receptionPlace,
        saveTheDateSettingMock.copyMessage,
        saveTheDateSettingMock.hotelName,
        saveTheDateSettingMock.hotelInformation
      );

      await saveTheDateSettings.clickSaveChanges();
      await saveTheDateSettings.waitToLoad();
      await saveTheDateSettings.waitForToast();

      await saveTheDateSettings.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      eventModal = await eventsPage.clickEditEventButton(0);
      await eventModal.waitForModalToShow();

      await eventModal.setTypeOfEvent(EventType.Wedding);
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

    settingsPage = new WeddingSettingsPage(page);
    await settingsPage.isSettingsPage();
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

  test('should be able to view all section', async () => {
    await settingsPage.selectEvent(saveTheDateEventMock.nameOfEvent);

    expect(await settingsPage.isInfoSectionVisible(), {
      message: 'The invite information section should be visible',
    }).toBe(true);

    expect(await settingsPage.isItinerarySectionVisible(), {
      message: 'The itinerary section should be visible',
    }).toBe(true);

    expect(await settingsPage.isDressCodeSectionVisible(), {
      message: 'The dress code section should be visible',
    }).toBe(true);

    expect(await settingsPage.isGiftsSectionVisible(), {
      message: 'The gifts section should be visible',
    }).toBe(true);

    expect(await settingsPage.isAccomodationSectionVisible(), {
      message: 'The accomodation section should be visible',
    }).toBe(true);
  });

  test('should be able to hide the itinerary section, dressCode section and gifts section', async () => {
    await settingsPage.selectEvent(saveTheDateEventMock.nameOfEvent);

    await settingsPage.clickItinerarySectionCheckbox(false);
    expect(await settingsPage.isItinerarySectionVisible(), {
      message: 'The itinerary section should not be visible',
    }).toBe(false);

    await settingsPage.clickDressCodeSectionCheckbox(false);
    expect(await settingsPage.isDressCodeSectionVisible(), {
      message: 'The dress code section should not be visible',
    }).toBe(false);

    await settingsPage.clickGiftsSectionCheckbox(false);
    expect(await settingsPage.isGiftsSectionVisible(), {
      message: 'The gifts section should not be visible',
    }).toBe(false);

    expect(await settingsPage.isInfoSectionVisible(), {
      message: 'The invite information section should be visible',
    }).toBe(true);

    expect(await settingsPage.isAccomodationSectionVisible(), {
      message: 'The accomodation section should be visible',
    }).toBe(true);
  });

  test('should be able to fill the form and save the settings', async () => {
    await settingsPage.selectEvent(saveTheDateEventMock.nameOfEvent);

    await settingsPage.fillInviteInformationSection(
      weddingSettingMock.weddingPrimaryColor,
      weddingSettingMock.weddingSecondaryColor,
      weddingSettingMock.copyMessage,
      weddingSettingMock.groomParents,
      weddingSettingMock.brideParents
    );

    const dateOfMass = weddingSettingMock.massTime.split(' ');
    const massTime = toLocalDate(`${dateOfMass[0]}T${dateOfMass[1]}.000Z`)
      .split('T')[1]
      .substring(0, 5);

    const dateOfCivil = weddingSettingMock.civilTime.split(' ');
    const civilTime = toLocalDate(`${dateOfCivil[0]}T${dateOfCivil[1]}.000Z`)
      .split('T')[1]
      .substring(0, 5);

    const dateOfVenue = weddingSettingMock.venueTime.split(' ');
    const venueTime = toLocalDate(`${dateOfVenue[0]}T${dateOfVenue[1]}.000Z`)
      .split('T')[1]
      .substring(0, 5);

    await settingsPage.fillItinerarySection(
      weddingSettingMock.massUrl,
      massTime,
      weddingSettingMock.massPlace,
      weddingSettingMock.civilUrl,
      civilTime,
      weddingSettingMock.civilPlace,
      weddingSettingMock.venueUrl,
      venueTime,
      weddingSettingMock.venuePlace
    );

    await settingsPage.fillDressCodeSection(weddingSettingMock.dressCodeColor);

    await settingsPage.fillGiftsSection(
      weddingSettingMock.cardNumber,
      weddingSettingMock.clabeBank
    );

    await settingsPage.fillAccomodationSection(
      weddingSettingMock.hotelUrl,
      weddingSettingMock.hotelPhone,
      weddingSettingMock.hotelAddress
    );

    await settingsPage.clickSaveChanges();
    await settingsPage.waitToLoad();
    await settingsPage.waitForToast();
  });
});
