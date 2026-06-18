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
import { IDesign } from 'src/app/core/models/designs';
import { EventType } from 'src/app/core/models/enum';
import { IEventType } from 'src/app/core/models/event-types';
import {
  saveTheDateSettingMock,
  sweetXvSettingMock,
  weddingSettingMock,
} from 'src/tests/mocks/mocks';

test.describe('Dashboard settings (Sweet Xv)', () => {
  let environmentCleaned = false;
  let settingsPage: SweetXvSettingsPage;
  let eventTypes: IEventType[];
  let designs: IDesign[];

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

      const eventTypesResponsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/eventtypes') &&
          response.status() === 200,
      );

      const designsResponsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/designs') && response.status() === 200,
      );

      const eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      eventTypes = await (await eventTypesResponsePromise).json();
      designs = await (await designsResponsePromise).json();

      const eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitForModalToShow();

      const eventType = eventTypes.find(
        (s) => s.name === EventType.Xv,
      ) as IEventType;
      const design = designs.find(
        (d) => d.eventTypeId === eventType.id,
      ) as IDesign;

      await eventModal.fillEventForm(
        sweetXvEventMock.nameOfEvent,
        sweetXvEventMock.dateOfEvent,
        sweetXvEventMock.maxDateOfConfirmation,
        eventType.id,
        design.id,
        sweetXvEventMock.nameOfCelebrated,
        sweetXvEventMock.assignedUser,
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

    await settingsPage.fillSweetXvSettings(
      sweetXvSettingMock.primaryColor,
      sweetXvSettingMock.secondaryColor,
      sweetXvSettingMock.parents,
      sweetXvSettingMock.godParents,
      sweetXvSettingMock.firstSectionSentences,
      sweetXvSettingMock.secondSectionSentences,
      sweetXvSettingMock.massUrl,
      '17:00',
      sweetXvSettingMock.massAddress,
      sweetXvSettingMock.receptionUrl,
      '18:00',
      sweetXvSettingMock.receptionPlace,
      sweetXvSettingMock.receptionAddress,
      sweetXvSettingMock.dressCodeColor,
    );

    await settingsPage.clickSaveChanges();
    await settingsPage.waitToLoad();
    await settingsPage.waitForToast();
  });
});

test.describe('Dashboard settings (Save the date)', () => {
  let environmentCleaned = false;
  let settingsPage: SaveTheDateSettingsPage;
  let eventTypes: IEventType[];
  let designs: IDesign[];

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

      const eventTypesResponsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/eventtypes') &&
          response.status() === 200,
      );

      const designsResponsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/designs') && response.status() === 200,
      );

      const eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      eventTypes = await (await eventTypesResponsePromise).json();
      designs = await (await designsResponsePromise).json();

      const eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitForModalToShow();

      const eventType = eventTypes.find(
        (s) => s.name === EventType.SaveTheDate,
      ) as IEventType;
      const design = designs.find(
        (d) => d.eventTypeId === eventType.id,
      ) as IDesign;

      await eventModal.fillEventForm(
        saveTheDateEventMock.nameOfEvent,
        saveTheDateEventMock.dateOfEvent,
        saveTheDateEventMock.maxDateOfConfirmation,
        eventType.id,
        design.id,
        saveTheDateEventMock.nameOfCelebrated,
        saveTheDateEventMock.assignedUser,
      );

      await eventModal.clickConfirmButton();
      await eventsPage.waitToLoad();
      await eventsPage.waitForToast();

      await eventsPage.clickSettingsLink();
      environmentCleaned = true;
    } else {
      const dashboardPage = (await loginPage.login(
        invitesAdminUser.username,
        invitesAdminUser.password,
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
      saveTheDateSettingMock.hotelInformation,
    );

    await settingsPage.clickSaveChanges();
    await settingsPage.waitToLoad();
    await settingsPage.waitForToast();
  });
});

test.describe('Dashboard settings (Wedding)', () => {
  let environmentCleaned = false;
  let settingsPage: WeddingSettingsPage;
  let eventTypes: IEventType[];
  let designs: IDesign[];

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

      const eventTypesResponsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/eventtypes') &&
          response.status() === 200,
      );

      const designsResponsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/designs') && response.status() === 200,
      );

      let eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      eventTypes = await (await eventTypesResponsePromise).json();
      designs = await (await designsResponsePromise).json();

      let eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitForModalToShow();

      let eventType = eventTypes.find(
        (s) => s.name === EventType.SaveTheDate,
      ) as IEventType;
      let design = designs.find(
        (d) => d.eventTypeId === eventType.id,
      ) as IDesign;

      await eventModal.fillEventForm(
        saveTheDateEventMock.nameOfEvent,
        saveTheDateEventMock.dateOfEvent,
        saveTheDateEventMock.maxDateOfConfirmation,
        eventType.id,
        design.id,
        saveTheDateEventMock.nameOfCelebrated,
        saveTheDateEventMock.assignedUser,
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
        saveTheDateSettingMock.hotelInformation,
      );

      await saveTheDateSettings.clickSaveChanges();
      await saveTheDateSettings.waitToLoad();
      await saveTheDateSettings.waitForToast();

      await saveTheDateSettings.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      eventModal = await eventsPage.clickEditEventButton(0);
      await eventModal.waitForModalToShow();

      eventType = eventTypes.find(
        (s) => s.name === EventType.Wedding,
      ) as IEventType;
      design = designs.find(
        (d) => d.eventTypeId === eventType.id,
      ) as IDesign;

      await eventModal.setEventTypeId(eventType.id);
      await eventModal.setDesignId(design.id);

      await eventModal.clickConfirmButton();
      await eventsPage.waitToLoad();
      await eventsPage.waitForToast();

      await eventsPage.clickSettingsLink();

      environmentCleaned = true;
    } else {
      const dashboardPage = (await loginPage.login(
        invitesAdminUser.username,
        invitesAdminUser.password,
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
      weddingSettingMock.brideParents,
    );

    await settingsPage.fillItinerarySection(
      weddingSettingMock.massUrl,
      '18:30',
      weddingSettingMock.massPlace,
      weddingSettingMock.civilUrl,
      '21:00',
      weddingSettingMock.civilPlace,
      weddingSettingMock.venueUrl,
      '22:00',
      weddingSettingMock.venuePlace,
    );

    await settingsPage.fillDressCodeSection(weddingSettingMock.dressCodeColor);

    await settingsPage.fillGiftsSection(
      weddingSettingMock.cardNumber,
      weddingSettingMock.clabeBank,
    );

    await settingsPage.fillAccomodationSection(
      weddingSettingMock.hotelUrl,
      weddingSettingMock.hotelPhone,
      weddingSettingMock.hotelAddress,
    );

    await settingsPage.clickSaveChanges();
    await settingsPage.waitToLoad();
    await settingsPage.waitForToast();
  });
});
