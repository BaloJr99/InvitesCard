import test, { expect } from '@playwright/test';
import { invitesAdminUser, sweetXvEventMock } from 'e2e/helper/mocks';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { DashboardPage } from 'e2e/pages/dashboard/dashboard-page';
import { EventsPage } from 'e2e/pages/dashboard/events/events-page';
import { FilesPage } from 'e2e/pages/dashboard/files/files-page';
import { TestingPage } from 'e2e/pages/dashboard/testing/testing-page';
import { EventType, ImageUsage } from 'src/app/core/models/enum';
import { IEventType } from 'src/app/core/models/event-types';

test.describe('Dashboard Files (Admin)', () => {
  let filesPage: FilesPage;
  let environmentCleaned = false;
  let eventTypes: IEventType[];

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

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/eventtypes') &&
          response.status() === 200,
      );

      const eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      const response = await responsePromise;
      eventTypes = await response.json();

      const eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitForModalToShow();

      await eventModal.fillEventForm(
        sweetXvEventMock.nameOfEvent,
        sweetXvEventMock.dateOfEvent,
        sweetXvEventMock.maxDateOfConfirmation,
        eventTypes.find((s) => s.name === EventType.Xv)?.id ?? '',
        sweetXvEventMock.nameOfCelebrated,
        sweetXvEventMock.assignedUser,
      );

      await eventModal.clickConfirmButton();
      await eventsPage.waitToLoad();
      await eventsPage.waitForToast();

      await eventsPage.clickFilesLink();
      environmentCleaned = true;
    } else {
      await dashboardPage.clickFilesLink();
    }

    filesPage = new FilesPage(page);
    await filesPage.waitToLoad();
  });

  test('should be able to upload image files', async () => {
    expect(await filesPage.filesEmptyMessage.textContent(), {
      message: 'Files empty message should be displayed',
    }).toBe('Please, select an event');

    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.uploadPhotos();
    await filesPage.clickSaveFiles();

    expect(await filesPage.getImageCardCount(), {
      message: 'Image card count should be 1',
    }).toBe(1);
  });

  test('should be able to upload audio files', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.uploadAudio();
    await filesPage.clickSaveFiles();

    expect(await filesPage.getAudioCardCount(), {
      message: 'Audio card count should be 1',
    }).toBe(1);
  });

  test('should be able to expand image card', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.clickScaleImage(0);

    expect(await filesPage.showImageVisible(), {
      message: 'Show image should be visible',
    }).toBe(true);
  });

  test('should be able to select image usage', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.selectImageUsage(0, ImageUsage.Both);
    await filesPage.clickSaveChanges();

    await filesPage.goto();
    await filesPage.waitToLoad();
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);

    const imageCard = await filesPage.getImageCard(0);
    expect(await imageCard.locator('select').inputValue(), {
      message: 'Image usage should be Both',
    }).toBe(ImageUsage.Both);
  });

  test('should be able to delete image card and audio card', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);

    const commonModal = await filesPage.deleteImage(0);
    await commonModal.waitForModalToShow();
    await commonModal.clickConfirmButton();
    await filesPage.waitToLoad();
    await filesPage.waitForToast();
    await commonModal.waitForModalToHide();

    await filesPage.deleteAudio(0);
    await commonModal.waitForModalToShow();
    await commonModal.clickConfirmButton();
    await filesPage.waitToLoad();
    await filesPage.waitForToast();
    await commonModal.waitForModalToHide();

    expect(await filesPage.getImageCardCount(), {
      message: 'Image card count should be 0',
    }).toBe(0);

    expect(await filesPage.getAudioCardCount(), {
      message: 'Audio card count should be 0',
    }).toBe(0);
  });
});

test.describe('Dashboard Files (invitesAdmin)', () => {
  let filesPage: FilesPage;
  let environmentCleaned = false;
  let eventTypes: IEventType[];

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

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/eventtypes') &&
          response.status() === 200,
      );

      const eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      const response = await responsePromise;
      eventTypes = await response.json();

      const eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitForModalToShow();

      await eventModal.fillEventForm(
        sweetXvEventMock.nameOfEvent,
        sweetXvEventMock.dateOfEvent,
        sweetXvEventMock.maxDateOfConfirmation,
        eventTypes.find((s) => s.name === EventType.Xv)?.id ?? '',
        sweetXvEventMock.nameOfCelebrated,
        sweetXvEventMock.assignedUser,
      );

      await eventModal.clickConfirmButton();
      await eventsPage.waitToLoad();
      await eventsPage.waitForToast();

      await eventsPage.clickFilesLink();
      environmentCleaned = true;
    } else {
      const dashboardPage = (await loginPage.login(
        invitesAdminUser.username,
        invitesAdminUser.password,
      )) as DashboardPage;
      await dashboardPage.waitToLoad();
      await dashboardPage.clickFilesLink();
    }

    filesPage = new FilesPage(page);
    await filesPage.waitToLoad();
  });

  test('should be able to upload image files', async () => {
    expect(await filesPage.filesEmptyMessage.textContent(), {
      message: 'Files empty message should be displayed',
    }).toBe('Please, select an event');

    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.uploadPhotos();
    await filesPage.clickSaveFiles();

    expect(await filesPage.getImageCardCount(), {
      message: 'Image card count should be 1',
    }).toBe(1);
  });

  test('should be able to upload audio files', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.uploadAudio();
    await filesPage.clickSaveFiles();

    expect(await filesPage.getAudioCardCount(), {
      message: 'Audio card count should be 1',
    }).toBe(1);
  });

  test('should be able to expand image card', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.clickScaleImage(0);

    expect(await filesPage.showImageVisible(), {
      message: 'Show image should be visible',
    }).toBe(true);
  });

  test('should be able to select image usage', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.selectImageUsage(0, ImageUsage.Both);
    await filesPage.clickSaveChanges();

    await filesPage.goto();
    await filesPage.waitToLoad();
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);

    const imageCard = await filesPage.getImageCard(0);
    expect(await imageCard.locator('select').inputValue(), {
      message: 'Image usage should be Both',
    }).toBe(ImageUsage.Both);
  });

  test('should be able to delete image card and audio card', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);

    const commonModal = await filesPage.deleteImage(0);
    await commonModal.waitForModalToShow();
    await commonModal.clickConfirmButton();
    await filesPage.waitToLoad();
    await filesPage.waitForToast();

    await filesPage.deleteAudio(0);
    await commonModal.waitForModalToShow();
    await commonModal.clickConfirmButton();
    await filesPage.waitToLoad();
    await filesPage.waitForToast();

    expect(await filesPage.getImageCardCount(), {
      message: 'Image card count should be 0',
    }).toBe(0);

    expect(await filesPage.getAudioCardCount(), {
      message: 'Audio card count should be 0',
    }).toBe(0);
  });
});
