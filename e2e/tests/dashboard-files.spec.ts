import test, { expect } from '@playwright/test';
import { invitesAdminUser, sweetXvEventMock } from 'e2e/helper/mocks';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { EventsPage } from 'e2e/pages/dashboard/events/events-page';
import { FilesPage } from 'e2e/pages/dashboard/files/files-page';
import { TestingPage } from 'e2e/pages/dashboard/testing/testing-page';
import { ImageUsage } from 'src/app/core/models/enum';

test.describe('Dashboard Files (Admin)', () => {
  let filesPage: FilesPage;
  let environmentCleaned = false;

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
    await filesPage.waitToLoad();

    expect(await filesPage.toastrIsShowing()).toBe(true);

    expect(await filesPage.getImageCardCount(), {
      message: 'Image card count should be 1',
    }).toBe(1);
  });

  test('should be able to upload audio files', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.uploadAudio();
    await filesPage.clickSaveFiles();
    await filesPage.waitToLoad();

    expect(await filesPage.toastrIsShowing()).toBe(true);

    expect(await filesPage.getAudioCardCount(), {
      message: 'Audio card count should be 1',
    }).toBe(1);
  });

  test('should be able to expand image card', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.waitToLoad();

    await filesPage.clickScaleImage(0);

    expect(await filesPage.showImageVisible(), {
      message: 'Show image should be visible',
    }).toBe(true);
  });

  test('should be able to select image usage', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.waitToLoad();

    await filesPage.selectImageUsage(0, ImageUsage.Both);
    await filesPage.clickSaveChanges();
    await filesPage.waitToLoad();

    await filesPage.goto();
    await filesPage.waitToLoad();
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.waitToLoad();

    const imageCard = await filesPage.getImageCard(0);
    expect(await imageCard.locator('select').inputValue(), {
      message: 'Image usage should be Both',
    }).toBe(ImageUsage.Both);
  });

  test('should be able to delete image card and audio card', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.waitToLoad();

    const commonModal = await filesPage.deleteImage(0);
    await commonModal.waitToLoad();
    await commonModal.clickConfirmButton();
    await filesPage.waitToLoad();
    expect(await filesPage.toastrIsShowing()).toBe(true);

    await filesPage.deleteAudio(0);
    await commonModal.waitToLoad();
    await commonModal.clickConfirmButton();
    await filesPage.waitToLoad();
    expect(await filesPage.toastrIsShowing()).toBe(true);

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

      await eventsPage.clickFilesLink();
      environmentCleaned = true;
    } else {
      const dashboardPage = await loginPage.login(
        invitesAdminUser.username,
        invitesAdminUser.password
      );
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
    await filesPage.waitToLoad();

    expect(await filesPage.toastrIsShowing()).toBe(true);

    expect(await filesPage.getImageCardCount(), {
      message: 'Image card count should be 1',
    }).toBe(1);
  });

  test('should be able to upload audio files', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.uploadAudio();
    await filesPage.clickSaveFiles();
    await filesPage.waitToLoad();

    expect(await filesPage.toastrIsShowing()).toBe(true);

    expect(await filesPage.getAudioCardCount(), {
      message: 'Audio card count should be 1',
    }).toBe(1);
  });

  test('should be able to expand image card', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.waitToLoad();

    await filesPage.clickScaleImage(0);

    expect(await filesPage.showImageVisible(), {
      message: 'Show image should be visible',
    }).toBe(true);
  });

  test('should be able to select image usage', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.waitToLoad();

    await filesPage.selectImageUsage(0, ImageUsage.Both);
    await filesPage.clickSaveChanges();
    await filesPage.waitToLoad();

    await filesPage.goto();
    await filesPage.waitToLoad();
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.waitToLoad();

    const imageCard = await filesPage.getImageCard(0);
    expect(await imageCard.locator('select').inputValue(), {
      message: 'Image usage should be Both',
    }).toBe(ImageUsage.Both);
  });

  test('should be able to delete image card and audio card', async () => {
    await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
    await filesPage.waitToLoad();

    const commonModal = await filesPage.deleteImage(0);
    await commonModal.waitToLoad();
    await commonModal.clickConfirmButton();
    await filesPage.waitToLoad();
    expect(await filesPage.toastrIsShowing()).toBe(true);

    await filesPage.deleteAudio(0);
    await commonModal.waitToLoad();
    await commonModal.clickConfirmButton();
    await filesPage.waitToLoad();
    expect(await filesPage.toastrIsShowing()).toBe(true);

    expect(await filesPage.getImageCardCount(), {
      message: 'Image card count should be 0',
    }).toBe(0);

    expect(await filesPage.getAudioCardCount(), {
      message: 'Audio card count should be 0',
    }).toBe(0);
  });
});