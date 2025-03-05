import test, { expect } from '@playwright/test';
import { CommonModal } from 'e2e/common/common-modal';
import { getFormattedDate } from 'e2e/helper/date-format';
import {
  confirmedInviteMock,
  groupMock,
  notConfirmedInviteMock,
  partialConfirmedInviteMock,
  pendingInviteMock,
  saveTheDateEventMock,
  sweetXvEventMock,
} from 'e2e/helper/mocks';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { EventDetailsPage } from 'e2e/pages/dashboard/events/event-details/event-details-page';
import { EventModal } from 'e2e/pages/dashboard/events/event-modal';
import { EventsPage } from 'e2e/pages/dashboard/events/events-page';
import { FilesPage } from 'e2e/pages/dashboard/files/files-page';
import { SaveTheDateSettingsPage } from 'e2e/pages/dashboard/settings/save-the-date-settings-page';
import { SweetXvSettingsPage } from 'e2e/pages/dashboard/settings/sweet-xv-settings-page';
import { WeddingSettingsPage } from 'e2e/pages/dashboard/settings/wedding-settings-page';
import { TestingPage } from 'e2e/pages/dashboard/testing/testing-page';
import { SaveTheDatePage } from 'e2e/pages/invites/save-the-date-page';
import { SweetXvPage } from 'e2e/pages/invites/sweet-xv-page';
import { WeddingPage } from 'e2e/pages/invites/wedding-page';
import { EventType, ImageUsage } from 'src/app/core/models/enum';
import { deepCopy, toLocalDate } from 'src/app/shared/utils/tools';
import {
  saveTheDateSettingMock,
  sweetXvSettingMock,
  weddingSettingMock,
} from 'src/tests/mocks/mocks';

let sweetXvSettingMockCopy = deepCopy(sweetXvSettingMock);
let eventId = '';

test.describe('Invites (Sweet Xv)', () => {
  sweetXvSettingMockCopy = {
    ...sweetXvSettingMockCopy,
    massTime: toLocalDate(
      sweetXvSettingMockCopy.massTime.replace(' ', 'T').concat('.000Z')
    )
      .split('T')[1]
      .substring(0, 5),
    receptionTime: toLocalDate(
      sweetXvSettingMockCopy.receptionTime.replace(' ', 'T').concat('.000Z')
    )
      .split('T')[1]
      .substring(0, 5),
  };

  let confirmedMessageLink: string;
  let notConfirmedMessageLink: string;
  let partialMessageLink: string;

  let eventsPage: EventsPage;
  let eventModal: EventModal;
  let eventDetailsPage: EventDetailsPage;
  let environmentCleaned = false;

  test.beforeEach(async ({ page, context }) => {
    // Grant clipboard permissions to browser context
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    // Clean environment and create a new event and invites
    if (!environmentCleaned) {
      confirmedMessageLink = '';
      notConfirmedMessageLink = '';
      partialMessageLink = '';

      //Login as admin
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      const dashboardPage = await loginPage.loginAsAdmin();

      await dashboardPage.clickTestingLink();
      const testingPage = new TestingPage(page);
      await testingPage.clickCleanEnvironmentButton();
      await testingPage.clickEventsLink();

      eventsPage = new EventsPage(page);
      await eventsPage.isEventsPage();
      await eventsPage.waitToLoad();

      eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitForModalToShow();

      // Create event
      await eventModal.fillEventForm(
        sweetXvEventMock.nameOfEvent,
        sweetXvEventMock.dateOfEvent,
        sweetXvEventMock.maxDateOfConfirmation,
        sweetXvEventMock.typeOfEvent,
        sweetXvEventMock.nameOfCelebrated,
        sweetXvEventMock.assignedUser
      );
      eventId = await eventModal.clickConfirmButtonAndReturnId();
      await eventsPage.waitToLoad();
      await eventsPage.waitForToast();

      // Fill settings Page
      await eventsPage.clickSettingsLink();
      const settingsPage = new SweetXvSettingsPage(page);
      await settingsPage.isSettingsPage();
      await settingsPage.waitToLoad();

      await settingsPage.selectEvent(sweetXvEventMock.nameOfEvent);

      await settingsPage.fillSweetXvSettings(
        sweetXvSettingMockCopy.primaryColor,
        sweetXvSettingMockCopy.secondaryColor,
        sweetXvSettingMockCopy.parents,
        sweetXvSettingMockCopy.godParents,
        sweetXvSettingMockCopy.firstSectionSentences,
        sweetXvSettingMockCopy.secondSectionSentences,
        sweetXvSettingMockCopy.massUrl,
        sweetXvSettingMockCopy.massTime,
        sweetXvSettingMockCopy.massAddress,
        sweetXvSettingMockCopy.receptionUrl,
        sweetXvSettingMockCopy.receptionTime,
        sweetXvSettingMockCopy.receptionPlace,
        sweetXvSettingMockCopy.receptionAddress,
        sweetXvSettingMockCopy.dressCodeColor
      );

      await settingsPage.clickSaveChanges();

      // Upload images
      await settingsPage.clickFilesLink();
      const filesPage = new FilesPage(page);
      await filesPage.isFilesPage();
      await filesPage.waitToLoad();

      await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);

      await filesPage.uploadPhotos();
      await filesPage.clickSaveFiles();

      await filesPage.selectImageUsage(0, ImageUsage.Both);
      await filesPage.clickSaveChanges();

      // Create invite
      await filesPage.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.isEventsPage();
      await eventsPage.waitToLoad();

      eventDetailsPage = await eventsPage.clickGoToInvitesButton(0, eventId);
      await eventDetailsPage.isEventDetailsPage();
      await eventDetailsPage.waitToLoad();

      let invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.clickAddNewGroupButton();
      await invitesModal.waitForGroupFormToLoad();
      await invitesModal.fillInviteGroupForm(groupMock.inviteGroup);

      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.fillInviteForm(
        confirmedInviteMock.family,
        confirmedInviteMock.inviteGroup,
        confirmedInviteMock.entriesNumber.toString(),
        confirmedInviteMock.contactNumber,
        confirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.fillInviteForm(
        notConfirmedInviteMock.family,
        notConfirmedInviteMock.inviteGroup,
        notConfirmedInviteMock.entriesNumber.toString(),
        notConfirmedInviteMock.contactNumber,
        notConfirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.fillInviteForm(
        partialConfirmedInviteMock.family,
        partialConfirmedInviteMock.inviteGroup,
        partialConfirmedInviteMock.entriesNumber.toString(),
        partialConfirmedInviteMock.contactNumber,
        partialConfirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.fillInviteForm(
        pendingInviteMock.family,
        pendingInviteMock.inviteGroup,
        pendingInviteMock.entriesNumber.toString(),
        pendingInviteMock.contactNumber,
        pendingInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      await eventDetailsPage.clickAccordion(groupMock.inviteGroup);

      // Store confirmed invite message link
      await eventDetailsPage.clickCopyButton(
        groupMock.inviteGroup,
        confirmedInviteMock.family
      );

      // Get clipboard content after the button has been clicked
      let handle = await page.evaluateHandle(() =>
        navigator.clipboard.readText()
      );
      let clipboardContent = await handle.jsonValue();
      confirmedMessageLink = clipboardContent;

      // Store not confirmed invite message link
      await eventDetailsPage.clickCopyButton(
        groupMock.inviteGroup,
        notConfirmedInviteMock.family
      );

      // Get clipboard content after the button has been clicked
      handle = await page.evaluateHandle(() => navigator.clipboard.readText());
      clipboardContent = await handle.jsonValue();
      notConfirmedMessageLink = clipboardContent;

      // Store partial confirmed invite message link
      await eventDetailsPage.clickCopyButton(
        groupMock.inviteGroup,
        partialConfirmedInviteMock.family
      );

      // Get clipboard content after the button has been clicked
      handle = await page.evaluateHandle(() => navigator.clipboard.readText());
      clipboardContent = await handle.jsonValue();
      partialMessageLink = clipboardContent;

      environmentCleaned = true;
    }
  });

  test('should have the right initial statistics', async () => {
    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      '34'
    );

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      '34'
    );
  });

  test('should be able to see Sweet Xv invite (confirmed version) to a user and see it', async ({
    page,
  }) => {
    const invitePage = new SweetXvPage(page);
    await invitePage.gotoInvitePage(confirmedMessageLink);
    await invitePage.waitForInviteToLoad();
    await invitePage.waitToLoad();

    // Check if the invite is correct
    expect(await invitePage.backgroundImage.isVisible(), {
      message: 'Background image should be visible',
    }).toBe(true);

    expect(await invitePage.nameOfCelebrated.textContent(), {
      message: 'Name of celebrated should be correct',
    }).toBe(sweetXvEventMock.nameOfCelebrated);

    const dateOfEvent = sweetXvEventMock.dateOfEvent.concat('T00:00:00');
    expect(await invitePage.dateOfEvent.textContent(), {
      message: 'Date of event should be correct',
    }).toBe(
      `${getFormattedDate(dateOfEvent, {
        weekday: 'long',
      }).toUpperCase()}, ${getFormattedDate(dateOfEvent, {
        day: 'numeric',
        month: 'long',
      }).toUpperCase()}`
    );

    expect(await invitePage.countdown.isVisible(), {
      message: 'Countdown should be visible',
    }).toBe(true);

    expect(await invitePage.firstSectionSentence_1.textContent(), {
      message: 'First section sentence 1 should be correct',
    }).toBe(sweetXvSettingMockCopy.firstSectionSentences.split(';')[0]);

    expect(await invitePage.family.textContent(), {
      message: 'Family should be correct',
    }).toBe(confirmedInviteMock.family);

    expect(await invitePage.numberOfEntries.textContent(), {
      message: 'Number of entries should be correct',
    }).toBe(`Entries: ${confirmedInviteMock.entriesNumber}`);

    expect(await invitePage.noKids.isVisible(), {
      message: 'No kids should not be visible',
    }).toBe(false);

    expect(await invitePage.firstSectionSentence_2.textContent(), {
      message: 'First section sentence 2 should be correct',
    }).toBe(sweetXvSettingMockCopy.firstSectionSentences.split(';')[1]);

    expect(await invitePage.father.textContent(), {
      message: 'Father should be correct',
    }).toBe(sweetXvSettingMockCopy.parents.split(';')[0]);

    expect(await invitePage.mother.textContent(), {
      message: 'Mother should be correct',
    }).toBe(sweetXvSettingMockCopy.parents.split(';')[1]);

    expect(await invitePage.godFather.textContent(), {
      message: 'God father should be correct',
    }).toBe(sweetXvSettingMockCopy.godParents.split(';')[0]);

    expect(await invitePage.godMother.textContent(), {
      message: 'God mother should be correct',
    }).toBe(sweetXvSettingMockCopy.godParents.split(';')[1]);

    expect(await invitePage.secondSectionSentence.textContent(), {
      message: 'Second section sentence should be correct',
    }).toContain(sweetXvSettingMockCopy.secondSectionSentences);

    expect(await invitePage.massTime.textContent(), {
      message: 'Mass time should be correct',
    }).toContain(sweetXvSettingMockCopy.massTime);

    expect(await invitePage.massAddress.textContent(), {
      message: 'Mass address should be correct',
    }).toBe(sweetXvSettingMockCopy.massAddress);

    expect(await invitePage.massIframe.isVisible(), {
      message: 'Mass iframe should be visible',
    }).toBe(true);

    expect(await invitePage.receptionIframe.isVisible(), {
      message: 'Reception iframe should be visible',
    }).toBe(true);

    expect(await invitePage.receptionPlace.textContent(), {
      message: 'Reception place should be correct',
    }).toBe(sweetXvSettingMockCopy.receptionPlace);

    expect(await invitePage.receptionAddress.textContent(), {
      message: 'Reception address should be correct',
    }).toBe(sweetXvSettingMockCopy.receptionAddress);

    expect(await invitePage.receptionTime.textContent(), {
      message: 'Reception time should be correct',
    }).toContain(sweetXvSettingMockCopy.receptionTime);

    expect(await invitePage.dressCodeColor.textContent(), {
      message: 'Dress code color should be correct',
    }).toContain(sweetXvSettingMockCopy.dressCodeColor);

    expect(await invitePage.giftsSection.isVisible(), {
      message: 'Gifts section should be visible',
    }).toBe(true);

    await invitePage.fillConfirmationForm(
      true,
      confirmedInviteMock.entriesNumber.toString(),
      'I will attend'
    );
    await invitePage.sendConfirmation();
    await invitePage.waitToLoad();

    expect(await invitePage.isInviteConfirmed(), {
      message: 'Invite should be confirmed',
    }).toBe(true);
  });

  test('should be able to see Sweet Xv invite (not confirmed version) to a user and see it', async ({
    page,
  }) => {
    const invitePage = new SweetXvPage(page);
    await invitePage.gotoInvitePage(notConfirmedMessageLink);
    await invitePage.waitForInviteToLoad();
    await invitePage.waitToLoad();

    expect(await invitePage.noKids.isVisible(), {
      message: 'No kids should be visible',
    }).toBe(true);

    await invitePage.fillConfirmationForm(false, null, 'I will not attend');
    await invitePage.sendConfirmation();
    await invitePage.waitToLoad();

    expect(await invitePage.isInviteNotConfirmed(), {
      message: `Invite shouldn't be confirmed`,
    }).toBe(true);
  });

  test('should be able to see Sweet Xv invite (partial confirmed version) to a user and see it', async ({
    page,
  }) => {
    const invitePage = new SweetXvPage(page);
    await invitePage.gotoInvitePage(partialMessageLink);
    await invitePage.waitForInviteToLoad();
    await invitePage.waitToLoad();

    await invitePage.fillConfirmationForm(true, '10', '');
    await invitePage.sendConfirmation();
    await invitePage.waitToLoad();

    expect(await invitePage.isInviteConfirmed(), {
      message: 'Invite should be confirmed',
    }).toBe(true);
  });

  test('should have the right final statistics', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();
    await dashboardPage.clickEventsLink();

    const eventsPage = new EventsPage(page);
    await eventsPage.isEventsPage();
    await eventsPage.waitToLoad();

    eventDetailsPage = await eventsPage.clickGoToInvitesButton(0, eventId);
    await eventDetailsPage.isEventDetailsPage();
    await eventDetailsPage.waitToLoad();

    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      '15'
    );

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('4');

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      '15'
    );

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      '34'
    );
  });
});

test.describe('Invites (Save The Date)', () => {
  let needsAccomodationMessageLink: string;
  let notNeedsAccomodationMessageLink: string;

  let eventsPage: EventsPage;
  let eventModal: EventModal;
  let eventDetailsPage: EventDetailsPage;
  let environmentCleaned = false;

  test.beforeEach(async ({ page, context }) => {
    // Grant clipboard permissions to browser context
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Clean environment and create a new event and invites
    if (!environmentCleaned) {
      needsAccomodationMessageLink = '';
      notNeedsAccomodationMessageLink = '';

      //Login as admin
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      const dashboardPage = await loginPage.loginAsAdmin();
      await dashboardPage.waitToLoad();

      await dashboardPage.clickTestingLink();
      const testingPage = new TestingPage(page);
      await testingPage.isTestingPage();
      await testingPage.clickCleanEnvironmentButton();

      await testingPage.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.isEventsPage();
      await eventsPage.waitToLoad();

      eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitForModalToShow();

      // Create event
      await eventModal.fillEventForm(
        saveTheDateEventMock.nameOfEvent,
        saveTheDateEventMock.dateOfEvent,
        saveTheDateEventMock.maxDateOfConfirmation,
        saveTheDateEventMock.typeOfEvent,
        saveTheDateEventMock.nameOfCelebrated,
        saveTheDateEventMock.assignedUser
      );
      eventId = await eventModal.clickConfirmButtonAndReturnId();
      await eventsPage.waitToLoad();
      await eventsPage.waitForToast();

      // Fill settings Page
      await eventsPage.clickSettingsLink();
      const settingsPage = new SaveTheDateSettingsPage(page);
      await settingsPage.isSettingsPage();
      await settingsPage.waitToLoad();

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

      // Upload images
      await settingsPage.clickFilesLink();
      const filesPage = new FilesPage(page);
      await filesPage.isFilesPage();
      await filesPage.waitToLoad();

      await filesPage.selectEvent(saveTheDateEventMock.nameOfEvent);

      await filesPage.uploadPhotos();
      await filesPage.clickSaveFiles();
      await filesPage.selectImageUsage(0, ImageUsage.Both);
      await filesPage.clickSaveChanges();

      // Create invite
      await filesPage.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.isEventsPage();
      await eventsPage.waitToLoad();

      eventDetailsPage = await eventsPage.clickGoToInvitesButton(0, eventId);
      await eventDetailsPage.isEventDetailsPage();
      await eventDetailsPage.waitToLoad();

      let invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.clickAddNewGroupButton();
      await invitesModal.waitForGroupFormToLoad();
      await invitesModal.fillInviteGroupForm(groupMock.inviteGroup);

      await invitesModal.clickConfirmButton();
      await invitesModal.waitForInviteFormToLoad();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      await invitesModal.fillInviteForm(
        confirmedInviteMock.family,
        confirmedInviteMock.inviteGroup,
        confirmedInviteMock.entriesNumber.toString(),
        confirmedInviteMock.contactNumber,
        confirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.fillInviteForm(
        notConfirmedInviteMock.family,
        notConfirmedInviteMock.inviteGroup,
        notConfirmedInviteMock.entriesNumber.toString(),
        notConfirmedInviteMock.contactNumber,
        notConfirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.fillInviteForm(
        pendingInviteMock.family,
        pendingInviteMock.inviteGroup,
        pendingInviteMock.entriesNumber.toString(),
        pendingInviteMock.contactNumber,
        pendingInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      await eventDetailsPage.clickAccordion(groupMock.inviteGroup);

      // Store confirmed invite message link
      await eventDetailsPage.clickCopyButton(
        groupMock.inviteGroup,
        confirmedInviteMock.family
      );

      // Get clipboard content after the button has been clicked
      let handle = await page.evaluateHandle(() =>
        navigator.clipboard.readText()
      );
      let clipboardContent = await handle.jsonValue();
      needsAccomodationMessageLink = clipboardContent;

      // Store not confirmed invite message link
      await eventDetailsPage.clickCopyButton(
        groupMock.inviteGroup,
        notConfirmedInviteMock.family
      );

      // Get clipboard content after the button has been clicked
      handle = await page.evaluateHandle(() => navigator.clipboard.readText());
      clipboardContent = await handle.jsonValue();
      notNeedsAccomodationMessageLink = clipboardContent;

      environmentCleaned = true;
    }
  });

  test('should have the right initial statistics', async () => {
    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('3');

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('3');
  });

  test('should be able to see Save the date invite (confirmed version) to a user and see it', async ({
    page,
  }) => {
    const invitePage = new SaveTheDatePage(page);
    await invitePage.gotoInvitePage(needsAccomodationMessageLink);
    await invitePage.waitForInviteToLoad();

    const commonModal = new CommonModal(page);
    await commonModal.waitForModalToShow();
    await commonModal.clickCancelButton();

    // Check if the invite is correct
    expect(await invitePage.backgroundImage.isVisible(), {
      message: 'Background image should be visible',
    }).toBe(true);

    expect(await invitePage.namesOfCelebrated.textContent(), {
      message: 'Name of celebrated (bride) should be correct',
    }).toContain(saveTheDateEventMock.nameOfCelebrated.split(';')[0]);

    expect(await invitePage.namesOfCelebrated.textContent(), {
      message: 'Name of celebrated (groom) should be correct',
    }).toContain(saveTheDateEventMock.nameOfCelebrated.split(';')[1]);

    const dateOfEvent = saveTheDateEventMock.dateOfEvent.concat('T00:00:00');
    expect(await invitePage.receptionDate.textContent(), {
      message: 'Date of event should be correct',
    }).toBe(
      getFormattedDate(dateOfEvent, {
        month: 'long',
        year: 'numeric',
      }).toUpperCase()
    );

    expect(await invitePage.receptionPlace.textContent(), {
      message: 'Reception place should be correct',
    }).toBe(saveTheDateSettingMock.receptionPlace);

    expect(await invitePage.dayOfTheWeek.textContent(), {
      message: 'Day of the week should be correct',
    }).toBe(
      getFormattedDate(dateOfEvent, {
        day: 'numeric',
      }).toUpperCase()
    );

    await invitePage.fillAccomodationForm(true);
    await invitePage.sendConfirmation();
    await invitePage.waitToLoad();

    expect(await invitePage.isInviteConfirmed(), {
      message: 'Invite should be confirmed',
    }).toBe(true);
  });

  test('should be able to see Save the date invite (not confirmed version) to a user and see it', async ({
    page,
  }) => {
    const invitePage = new SaveTheDatePage(page);
    await invitePage.gotoInvitePage(notNeedsAccomodationMessageLink);
    await invitePage.waitForInviteToLoad();

    const commonModal = new CommonModal(page);
    await commonModal.waitForModalToShow();
    await commonModal.clickCancelButton();

    await invitePage.fillAccomodationForm(false);
    await invitePage.sendConfirmation();
    await invitePage.waitToLoad();

    expect(await invitePage.isInviteConfirmed(), {
      message: 'Invite should be confirmed',
    }).toBe(true);
  });

  test('should have the right final statistics', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();
    await dashboardPage.clickEventsLink();

    const eventsPage = new EventsPage(page);
    await eventsPage.isEventsPage();
    await eventsPage.waitToLoad();

    eventDetailsPage = await eventsPage.clickGoToInvitesButton(0, eventId);
    await eventDetailsPage.isEventDetailsPage();
    await eventDetailsPage.waitToLoad();

    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('2');

    // Check if the needs accomodation invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('1');

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('1');

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('3');
  });
});

test.describe('Invites (Wedding)', () => {
  let confirmedMessageLink: string;
  let notConfirmedMessageLink: string;
  let partialMessageLink: string;

  let eventsPage: EventsPage;
  let eventModal: EventModal;
  let eventDetailsPage: EventDetailsPage;
  let environmentCleaned = false;

  test.beforeEach(async ({ page, context }, testInfo) => {
    testInfo.setTimeout(60000);
    // Grant clipboard permissions to browser context
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Clean environment and create a new event and invites
    if (!environmentCleaned) {
      confirmedMessageLink = '';
      notConfirmedMessageLink = '';
      partialMessageLink = '';

      //Login as admin
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      const dashboardPage = await loginPage.loginAsAdmin();
      await dashboardPage.waitToLoad();

      await dashboardPage.clickTestingLink();
      const testingPage = new TestingPage(page);
      await testingPage.isTestingPage();
      await testingPage.clickCleanEnvironmentButton();

      await testingPage.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.isEventsPage();
      await eventsPage.waitToLoad();

      eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitForModalToShow();

      // Create event
      await eventModal.fillEventForm(
        saveTheDateEventMock.nameOfEvent,
        saveTheDateEventMock.dateOfEvent,
        saveTheDateEventMock.maxDateOfConfirmation,
        saveTheDateEventMock.typeOfEvent,
        saveTheDateEventMock.nameOfCelebrated,
        saveTheDateEventMock.assignedUser
      );

      eventId = await eventModal.clickConfirmButtonAndReturnId();
      await eventsPage.waitToLoad();
      await eventsPage.waitForToast();

      // Fill settings Page
      await eventsPage.clickSettingsLink();
      const saveTheDateSettings = new SaveTheDateSettingsPage(page);
      await saveTheDateSettings.isSettingsPage();
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

      await saveTheDateSettings.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.isEventsPage();
      await eventsPage.waitToLoad();

      eventModal = await eventsPage.clickEditEventButton(0);
      await eventModal.waitForModalToShow();

      // Switch to wedding event
      await eventModal.setTypeOfEvent(EventType.Wedding);
      await eventModal.clickConfirmButton();
      await eventsPage.waitToLoad();
      await eventsPage.waitForToast();

      await eventsPage.clickSettingsLink();
      const weddingSettings = new WeddingSettingsPage(page);
      await weddingSettings.isSettingsPage();

      await weddingSettings.selectEvent(saveTheDateEventMock.nameOfEvent);

      await weddingSettings.fillInviteInformationSection(
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

      await weddingSettings.fillItinerarySection(
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

      await weddingSettings.fillDressCodeSection(
        weddingSettingMock.dressCodeColor
      );

      await weddingSettings.fillGiftsSection(
        weddingSettingMock.cardNumber,
        weddingSettingMock.clabeBank
      );

      await weddingSettings.fillAccomodationSection(
        weddingSettingMock.hotelUrl,
        weddingSettingMock.hotelPhone,
        weddingSettingMock.hotelAddress
      );

      await weddingSettings.clickSaveChanges();

      // Upload images
      await weddingSettings.clickFilesLink();
      const filesPage = new FilesPage(page);
      await filesPage.isFilesPage();
      await filesPage.waitToLoad();

      await filesPage.selectEvent(saveTheDateEventMock.nameOfEvent);

      await filesPage.uploadPhotos();
      await filesPage.clickSaveFiles();
      await filesPage.selectImageUsage(0, ImageUsage.Principal_Desktop);
      await filesPage.clickSaveChanges();

      // Create invite
      await filesPage.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.isEventsPage();
      await eventsPage.waitToLoad();

      eventDetailsPage = await eventsPage.clickGoToInvitesButton(0, eventId);
      await eventDetailsPage.isEventDetailsPage();
      await eventDetailsPage.waitToLoad();

      let invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.clickAddNewGroupButton();
      await invitesModal.waitForGroupFormToLoad();
      await invitesModal.fillInviteGroupForm(groupMock.inviteGroup);

      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.fillInviteForm(
        confirmedInviteMock.family,
        confirmedInviteMock.inviteGroup,
        confirmedInviteMock.entriesNumber.toString(),
        confirmedInviteMock.contactNumber,
        confirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.fillInviteForm(
        notConfirmedInviteMock.family,
        notConfirmedInviteMock.inviteGroup,
        notConfirmedInviteMock.entriesNumber.toString(),
        notConfirmedInviteMock.contactNumber,
        notConfirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.fillInviteForm(
        partialConfirmedInviteMock.family,
        partialConfirmedInviteMock.inviteGroup,
        partialConfirmedInviteMock.entriesNumber.toString(),
        partialConfirmedInviteMock.contactNumber,
        partialConfirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitForModalToShow();
      await invitesModal.waitForInviteFormToLoad();

      await invitesModal.fillInviteForm(
        pendingInviteMock.family,
        pendingInviteMock.inviteGroup,
        pendingInviteMock.entriesNumber.toString(),
        pendingInviteMock.contactNumber,
        pendingInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();
      await eventDetailsPage.waitForToast();

      await eventDetailsPage.clickAccordion(groupMock.inviteGroup);

      // Store confirmed invite message link
      await eventDetailsPage.clickCopyButton(
        groupMock.inviteGroup,
        confirmedInviteMock.family
      );

      // Get clipboard content after the button has been clicked
      let handle = await page.evaluateHandle(() =>
        navigator.clipboard.readText()
      );
      let clipboardContent = await handle.jsonValue();
      confirmedMessageLink = clipboardContent;

      // Store not confirmed invite message link
      await eventDetailsPage.clickCopyButton(
        groupMock.inviteGroup,
        notConfirmedInviteMock.family
      );

      // Get clipboard content after the button has been clicked
      handle = await page.evaluateHandle(() => navigator.clipboard.readText());
      clipboardContent = await handle.jsonValue();
      notConfirmedMessageLink = clipboardContent;

      // Store partial confirmed invite message link
      await eventDetailsPage.clickCopyButton(
        groupMock.inviteGroup,
        partialConfirmedInviteMock.family
      );

      // Get clipboard content after the button has been clicked
      handle = await page.evaluateHandle(() => navigator.clipboard.readText());
      clipboardContent = await handle.jsonValue();
      partialMessageLink = clipboardContent;

      environmentCleaned = true;
    }
  });

  test('should have the right initial statistics', async () => {
    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('3');

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('3');
  });

  test('should be able to see Wedding (confirmed version) to a user and see it', async ({
    page,
  }) => {
    const invitePage = new WeddingPage(page);
    await invitePage.gotoInvitePage(confirmedMessageLink);
    await invitePage.waitForInviteToLoad();
    await invitePage.waitToLoad();

    // Check if the invite is correct
    expect(await invitePage.backgroundImage.isVisible(), {
      message: 'Background image should be visible',
    }).toBe(true);

    expect(await invitePage.nameOfCelebrated.textContent(), {
      message: 'Name of celebrated should containt the bride name',
    }).toContain(
      saveTheDateEventMock.nameOfCelebrated.split(';')[0].split(' ')[0]
    );

    expect(await invitePage.nameOfCelebrated.textContent(), {
      message: 'Name of celebrated should containt the groom name',
    }).toContain(
      saveTheDateEventMock.nameOfCelebrated.split(';')[1].split(' ')[0]
    );

    const dateOfEvent = saveTheDateEventMock.dateOfEvent.concat('T00:00:00');
    expect(await invitePage.dateOfEvent.textContent(), {
      message: 'Date of event should be correct',
    }).toBe(
      `${getFormattedDate(dateOfEvent, {
        weekday: 'long',
      }).toUpperCase()}, ${getFormattedDate(dateOfEvent, {
        day: 'numeric',
        month: 'long',
      }).toUpperCase()}`
    );

    expect(await invitePage.countdown.isVisible(), {
      message: 'Countdown should be visible',
    }).toBe(true);

    expect(await invitePage.family.textContent(), {
      message: 'Family should be correct',
    }).toBe(confirmedInviteMock.family);

    expect(await invitePage.groomParents.nth(0).textContent(), {
      message: 'Groom father should be correct',
    }).toContain(weddingSettingMock.groomParents.split(';')[0]);

    expect(await invitePage.groomParents.nth(1).textContent(), {
      message: 'Groom mother should be correct',
    }).toContain(weddingSettingMock.groomParents.split(';')[1]);

    expect(await invitePage.brideParents.nth(0).textContent(), {
      message: 'Bride father should be correct',
    }).toContain(weddingSettingMock.brideParents.split(';')[0]);

    expect(await invitePage.brideParents.nth(1).textContent(), {
      message: 'Bride mother should be correct',
    }).toContain(weddingSettingMock.brideParents.split(';')[1]);

    expect(await invitePage.noKids.isVisible(), {
      message: 'No kids should not be visible',
    }).toBe(false);

    const dateOfMass = weddingSettingMock.massTime.split(' ');
    const massTime = toLocalDate(`${dateOfMass[0]}T${dateOfMass[1]}.000Z`)
      .split('T')[1]
      .substring(0, 5);

    expect(await invitePage.massTime.textContent(), {
      message: 'Mass time should be correct',
    }).toContain(massTime);

    expect(await invitePage.massAddress.textContent(), {
      message: 'Mass address should be correct',
    }).toBe(weddingSettingMock.massPlace);

    expect(await invitePage.massUrlAddress.getAttribute('href'), {
      message: 'Mass url should be visible',
    }).toBe(weddingSettingMock.massUrl);

    const dateOfCivil = weddingSettingMock.civilTime.split(' ');
    const civilTime = toLocalDate(`${dateOfCivil[0]}T${dateOfCivil[1]}.000Z`)
      .split('T')[1]
      .substring(0, 5);

    expect(await invitePage.civilTime.textContent(), {
      message: 'Civil time should be correct',
    }).toContain(civilTime);

    expect(await invitePage.civilPlace.textContent(), {
      message: 'Civil place should be correct',
    }).toBe(weddingSettingMock.civilPlace);

    expect(await invitePage.civilUrlAddress.getAttribute('href'), {
      message: 'Civil iframe should be visible',
    }).toBe(weddingSettingMock.civilUrl);

    const dateOfVenue = weddingSettingMock.venueTime.split(' ');
    const venueTime = toLocalDate(`${dateOfVenue[0]}T${dateOfVenue[1]}.000Z`)
      .split('T')[1]
      .substring(0, 5);

    expect(await invitePage.venueTime.textContent(), {
      message: 'Venue time should be correct',
    }).toContain(venueTime);

    expect(await invitePage.venuePlace.textContent(), {
      message: 'Venue place should be correct',
    }).toBe(weddingSettingMock.venuePlace);

    expect(await invitePage.venueUrlAddress.getAttribute('href'), {
      message: 'Venue url should be visible',
    }).toBe(weddingSettingMock.venueUrl);

    expect(await invitePage.dressCode.textContent(), {
      message: 'Dress code should be correct',
    }).toContain(weddingSettingMock.dressCodeColor);

    expect(await invitePage.cardNumber.textContent(), {
      message: 'Card number should be correct',
    }).toContain(weddingSettingMock.cardNumber);

    expect(await invitePage.CLABE.textContent(), {
      message: 'Clabe bank should be correct',
    }).toContain(weddingSettingMock.clabeBank);

    expect(await invitePage.hotelUrlAddress.getAttribute('href'), {
      message: 'Hotel url should be visible',
    }).toBe(weddingSettingMock.hotelUrl);

    expect(await invitePage.hotelPhoneNumber.textContent(), {
      message: 'Hotel phone should be correct',
    }).toContain(weddingSettingMock.hotelPhone);

    expect(await invitePage.hotelAddress.textContent(), {
      message: 'Hotel address should be correct',
    }).toBe(weddingSettingMock.hotelAddress);

    await invitePage.fillConfirmationForm(
      true,
      confirmedInviteMock.entriesNumber.toString(),
      'I will attend'
    );
    await invitePage.sendConfirmation();
    await invitePage.waitToLoad();

    expect(await invitePage.isInviteConfirmed(), {
      message: 'Invite should be confirmed',
    }).toBe(true);
  });

  test('should be able to see Wedding invite (not confirmed version) to a user and see it', async ({
    page,
  }) => {
    const invitePage = new WeddingPage(page);
    await invitePage.gotoInvitePage(notConfirmedMessageLink);
    await invitePage.waitForInviteToLoad();
    await invitePage.waitToLoad();

    expect(await invitePage.noKids.isVisible(), {
      message: 'No kids should be visible',
    }).toBe(true);

    await invitePage.fillConfirmationForm(false, null, 'I will not attend');
    await invitePage.sendConfirmation();
    await invitePage.waitToLoad();

    expect(await invitePage.isInviteNotConfirmed(), {
      message: `Invite shouldn't be confirmed`,
    }).toBe(true);
  });

  test('should be able to see Wedding invite (partial confirmed version) to a user and see it', async ({
    page,
  }) => {
    const invitePage = new WeddingPage(page);
    await invitePage.gotoInvitePage(partialMessageLink);
    await invitePage.waitForInviteToLoad();
    await invitePage.waitToLoad();

    await invitePage.fillConfirmationForm(true, '10', '');
    await invitePage.sendConfirmation();
    await invitePage.waitToLoad();

    expect(await invitePage.isInviteConfirmed(), {
      message: 'Invite should be confirmed',
    }).toBe(true);
  });

  test('should have the right final statistics', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();
    await dashboardPage.clickEventsLink();

    const eventsPage = new EventsPage(page);
    await eventsPage.isEventsPage();
    await eventsPage.waitToLoad();

    eventDetailsPage = await eventsPage.clickGoToInvitesButton(0, eventId);
    await eventDetailsPage.isEventDetailsPage();
    await eventDetailsPage.waitToLoad();

    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      '15'
    );

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('4');

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      '15'
    );

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      '34'
    );
  });
});
