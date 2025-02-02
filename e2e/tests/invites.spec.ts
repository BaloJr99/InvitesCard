import test, { expect } from '@playwright/test';
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
import { SettingsPage } from 'e2e/pages/dashboard/settings/settings-page';
import { TestingPage } from 'e2e/pages/dashboard/testing/testing-page';
import { SaveTheDatePage } from 'e2e/pages/invites/save-the-date-page';
import { SweetXvPage } from 'e2e/pages/invites/sweet-xv-page';
import { ImageUsage } from 'src/app/core/models/enum';
import { deepCopy, toLocalDate } from 'src/app/shared/utils/tools';
import {
  saveTheDateSettingMock,
  sweetXvSettingMock,
} from 'src/tests/mocks/mocks';

let sweetXvSettingMockCopy = deepCopy(sweetXvSettingMock);

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
      await testingPage.clickCleanEnvironmentButton();
      await testingPage.waitToLoad();

      await testingPage.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitToLoad();
      // Grant clipboard permissions to browser context
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Create event
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

      // Fill settings Page
      await eventsPage.clickSettingsLink();
      const settingsPage = new SettingsPage(page);
      await settingsPage.waitToLoad();

      await settingsPage.selectEvent(sweetXvEventMock.nameOfEvent);
      await settingsPage.waitToLoad();

      await settingsPage.fillSweet16Settings(
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
      await settingsPage.waitToLoad();

      // Upload images
      await settingsPage.clickFilesLink();
      const filesPage = new FilesPage(page);
      await filesPage.waitToLoad();

      await filesPage.selectEvent(sweetXvEventMock.nameOfEvent);
      await filesPage.waitToLoad();

      await filesPage.uploadPhotos();
      await filesPage.clickSaveFiles();
      await filesPage.waitToLoad();

      await filesPage.selectImageUsage(0, ImageUsage.Both);
      await filesPage.clickSaveChanges();
      await filesPage.waitToLoad();

      // Create invite
      await filesPage.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
      await eventDetailsPage.waitToLoad();

      let invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitToLoad();

      await invitesModal.clickAddNewGroupButton();
      await invitesModal.fillInviteGroupForm(groupMock.inviteGroup);

      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();

      await invitesModal.fillInviteForm(
        confirmedInviteMock.family,
        confirmedInviteMock.inviteGroup,
        confirmedInviteMock.entriesNumber.toString(),
        confirmedInviteMock.contactNumber,
        confirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitToLoad();

      await invitesModal.fillInviteForm(
        notConfirmedInviteMock.family,
        notConfirmedInviteMock.inviteGroup,
        notConfirmedInviteMock.entriesNumber.toString(),
        notConfirmedInviteMock.contactNumber,
        notConfirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitToLoad();

      await invitesModal.fillInviteForm(
        partialConfirmedInviteMock.family,
        partialConfirmedInviteMock.inviteGroup,
        partialConfirmedInviteMock.entriesNumber.toString(),
        partialConfirmedInviteMock.contactNumber,
        partialConfirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitToLoad();

      await invitesModal.fillInviteForm(
        pendingInviteMock.family,
        pendingInviteMock.inviteGroup,
        pendingInviteMock.entriesNumber.toString(),
        pendingInviteMock.contactNumber,
        pendingInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();

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
    }).toBe(notConfirmedInviteMock.family);

    expect(await invitePage.numberOfEntries.textContent(), {
      message: 'Number of entries should be correct',
    }).toBe(`Entries: ${notConfirmedInviteMock.entriesNumber}`);

    expect(await invitePage.noKids.isVisible(), {
      message: 'No kids should not be visible',
    }).toBe(true);

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
    }).toBe(partialConfirmedInviteMock.family);

    expect(await invitePage.numberOfEntries.textContent(), {
      message: 'Number of entries should be correct',
    }).toBe(`Entries: ${partialConfirmedInviteMock.entriesNumber}`);

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
    await eventsPage.waitToLoad();

    eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
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
      await testingPage.clickCleanEnvironmentButton();
      await testingPage.waitToLoad();

      await testingPage.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      eventModal = await eventsPage.clickNewEventButton();
      await eventModal.waitToLoad();
      // Grant clipboard permissions to browser context
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Create event
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

      // Fill settings Page
      await eventsPage.clickSettingsLink();
      const settingsPage = new SettingsPage(page);
      await settingsPage.waitToLoad();

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

      // Upload images
      await settingsPage.clickFilesLink();
      const filesPage = new FilesPage(page);
      await filesPage.waitToLoad();

      await filesPage.selectEvent(saveTheDateEventMock.nameOfEvent);
      await filesPage.waitToLoad();

      await filesPage.uploadPhotos();
      await filesPage.clickSaveFiles();
      await filesPage.waitToLoad();

      await filesPage.selectImageUsage(0, ImageUsage.Both);
      await filesPage.clickSaveChanges();
      await filesPage.waitToLoad();

      // Create invite
      await filesPage.clickEventsLink();
      eventsPage = new EventsPage(page);
      await eventsPage.waitToLoad();

      eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
      await eventDetailsPage.waitToLoad();

      let invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitToLoad();

      await invitesModal.clickAddNewGroupButton();
      await invitesModal.fillInviteGroupForm(groupMock.inviteGroup);

      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();

      await invitesModal.fillInviteForm(
        confirmedInviteMock.family,
        confirmedInviteMock.inviteGroup,
        confirmedInviteMock.entriesNumber.toString(),
        confirmedInviteMock.contactNumber,
        confirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitToLoad();

      await invitesModal.fillInviteForm(
        notConfirmedInviteMock.family,
        notConfirmedInviteMock.inviteGroup,
        notConfirmedInviteMock.entriesNumber.toString(),
        notConfirmedInviteMock.contactNumber,
        notConfirmedInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();

      invitesModal = await eventDetailsPage.clickNewInviteButton();
      await invitesModal.waitToLoad();

      await invitesModal.fillInviteForm(
        pendingInviteMock.family,
        pendingInviteMock.inviteGroup,
        pendingInviteMock.entriesNumber.toString(),
        pendingInviteMock.contactNumber,
        pendingInviteMock.kidsAllowed
      );
      await invitesModal.clickConfirmButton();
      await eventDetailsPage.waitToLoad();

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
    await eventsPage.waitToLoad();

    eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
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
