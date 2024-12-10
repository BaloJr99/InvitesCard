import { test, expect } from '@playwright/test';
import { CommonModal } from 'e2e/common/common-modal';
import { getFormattedDate } from 'e2e/helper/date-format';
import {
  confirmedInviteMock,
  groupMock,
  invitesAdminUser,
  sweetXvEventMock,
} from 'e2e/helper/mocks';
import { LoginPage } from 'e2e/pages/auth/login-page';
import { EventModal } from 'e2e/pages/dashboard/events/event-modal';
import { EventsPage } from 'e2e/pages/dashboard/events/events-page';
import { TestingPage } from 'e2e/pages/dashboard/testing/testing-page';
import { EventType } from 'src/app/core/models/enum';
import { saveTheDateUserInviteMock } from 'src/tests/mocks/mocks';

test.describe('Dashboard Events (Admin)', () => {
  let eventsPage: EventsPage;
  let eventModal: EventModal;
  let environmentCleaned = false;

  // Login as admin before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();

    if (!environmentCleaned) {
      await dashboardPage.clickTestingLink();
      const testingPage = new TestingPage(page);
      await testingPage.clickCleanEnvironmentButton();
      await testingPage.waitToLoad();

      await testingPage.clickEventsLink();
      environmentCleaned = true;
    } else {
      await dashboardPage.clickEventsLink();
    }

    eventsPage = new EventsPage(page);
    await eventsPage.waitToLoad();
  });

  test('should be able to see new event button', async () => {
    expect(await eventsPage.isNewEventButtonVisible(), {
      message: 'New Event button should be visible',
    }).toBe(true);
  });

  test('should show validation errors when creating an event with invalid data', async () => {
    eventModal = await eventsPage.clickNewEventButton();
    await eventsPage.waitToLoad();

    await eventModal.clickConfirmButton();

    const validationErrors = await eventModal.getValidationErrors();
    expect(validationErrors[0]).toContain('The event name is required');
    expect(validationErrors[1]).toContain('The event date is required');
    expect(validationErrors[2]).toContain(
      'The deadline confirmation is required'
    );
    expect(validationErrors[3]).toContain('Select an event type');
    expect(validationErrors[4]).toContain(
      'The name of the celebrated is required'
    );
    expect(validationErrors[5]).toContain('Assign a user');
  });

  test('should be able to create an event', async () => {
    expect(await eventsPage.getEventCardsCount(), {
      message: 'There should be no events',
    }).toBe(0);

    eventModal = await eventsPage.clickNewEventButton();
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

    expect(await eventsPage.getEventCardsCount(), {
      message: 'There should be 1 event',
    }).toBe(1);

    const eventCard = eventsPage.getEventCard(0);

    expect(await eventCard.locator('h5').textContent()).toContain(
      sweetXvEventMock.nameOfEvent
    );

    expect(await eventCard.locator('p').textContent()).toContain(
      getFormattedDate(sweetXvEventMock.dateOfEvent.concat('T00:00:00'), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  });

  test('should be able to edit an event', async () => {
    expect(await eventsPage.isEditEventButtonVisible(0), {
      message: 'Edit Event button should be visible',
    }).toBe(true);

    eventModal = await eventsPage.clickEditEventButton(0);
    await eventsPage.waitToLoad();

    await eventModal.setEventName('New Event Name');

    await eventModal.clickConfirmButton();

    await eventsPage.waitToLoad();
    expect(await eventsPage.toastrIsShowing()).toBe(true);

    const eventCard = eventsPage.getEventCard(0);

    expect(await eventCard.locator('h5').textContent()).toContain(
      'New Event Name'
    );
  });

  test('should be able to navigate to the event details page', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    await eventDetailsPage.isEventDetailsPage();
  });

  test('should be able to add new group to an invite', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    const inviteModal = await eventDetailsPage.clickNewInviteButton();
    await eventDetailsPage.waitToLoad();

    await inviteModal.clickAddNewGroupButton();
    await inviteModal.fillInviteGroupForm(groupMock.inviteGroup);

    await inviteModal.clickConfirmButton();
    await eventDetailsPage.waitToLoad();
    expect(await eventDetailsPage.toastrIsShowing()).toBe(true);

    const options = await inviteModal.getInviteGroupOptions();
    expect(options.includes(groupMock.inviteGroup)).toBe(true);
  });

  test('should be able to add new invite', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();
    const inviteModal = await eventDetailsPage.clickNewInviteButton();

    await inviteModal.fillInviteForm(
      confirmedInviteMock.family,
      confirmedInviteMock.inviteGroup,
      confirmedInviteMock.entriesNumber.toString(),
      confirmedInviteMock.contactNumber,
      confirmedInviteMock.kidsAllowed
    );

    await inviteModal.clickConfirmButton();

    await eventDetailsPage.waitToLoad();
    expect(await eventDetailsPage.toastrIsShowing()).toBe(true);

    expect(await eventDetailsPage.getAccordionsCount(), {
      message: 'There should be 1 invite group',
    }).toBe(1);

    expect(
      await eventDetailsPage.getInviteGroupInviteCount(
        confirmedInviteMock.inviteGroup
      ),
      {
        message: 'There should be 1 invite',
      }
    ).toBe(1);

    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('h5').textContent()).toContain(
      'Confirmed entries'
    );
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('h5').textContent()).toContain(
      'Pending entries'
    );
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      `${confirmedInviteMock.entriesNumber}`
    );

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('h5').textContent()).toContain(
      'Canceled entries'
    );
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('h5').textContent()).toContain(
      'Total entries'
    );
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      `${confirmedInviteMock.entriesNumber}`
    );

    // Open accordion
    await eventDetailsPage.clickAccordion(confirmedInviteMock.inviteGroup);

    const tableRow = await eventDetailsPage.getInviteRow(
      groupMock.inviteGroup,
      confirmedInviteMock.family
    );

    const columns = await tableRow.locator('td').all();

    expect(await columns[1].textContent(), {
      message: 'Family name should be ' + confirmedInviteMock.family,
    }).toBe(confirmedInviteMock.family);

    expect(await columns[2].textContent(), {
      message: `Entries number should be 0 / ${confirmedInviteMock.entriesNumber}`,
    }).toBe(`0 / ${confirmedInviteMock.entriesNumber}`);

    expect(await columns[3].textContent(), {
      message: 'Third column should be empty',
    }).toBe('');

    const lastColumn = await columns[4].locator('button').all();
    expect(lastColumn.length, {
      message: 'There should be 3 buttons',
    }).toBe(3);
  });

  test('should be able to edit an invite', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    // Open accordion
    await eventDetailsPage.clickAccordion(confirmedInviteMock.inviteGroup);

    let inviteModal = await eventDetailsPage.clickEditButton(
      groupMock.inviteGroup,
      confirmedInviteMock.family
    );

    await inviteModal.waitToLoad();

    expect(await inviteModal.familyInput.inputValue()).toBe(
      confirmedInviteMock.family
    );
    expect(await inviteModal.getOptionSelected()).toBe(
      confirmedInviteMock.inviteGroup
    );
    expect(await inviteModal.entriesNumberInput.inputValue()).toBe(
      confirmedInviteMock.entriesNumber.toString()
    );
    expect(await inviteModal.contactNumberInput.inputValue()).toBe(
      confirmedInviteMock.contactNumber
    );
    expect(await inviteModal.kidsAllowedCheckbox.isChecked()).toBe(
      confirmedInviteMock.kidsAllowed
    );

    await inviteModal.fillInviteForm(
      'New Family Name',
      groupMock.inviteGroup,
      '2',
      '9876543210',
      false
    );

    await inviteModal.clickConfirmButton();
    await eventDetailsPage.waitToLoad();
    expect(await eventDetailsPage.toastrIsShowing()).toBe(true);

    // Open accordion
    await eventDetailsPage.clickAccordion(confirmedInviteMock.inviteGroup);

    const tableRow = await eventDetailsPage.getInviteRow(
      groupMock.inviteGroup,
      'New Family Name'
    );

    const columns = await tableRow.locator('td').all();

    expect(await columns[1].textContent(), {
      message: 'Family name should be New Family Name',
    }).toBe('New Family Name');

    expect(await columns[2].textContent(), {
      message: `Entries number should be 0 / 2`,
    }).toBe(`0 / 2`);

    expect(await columns[3].textContent(), {
      message: 'Third column should be empty',
    }).toBe('');

    const lastColumn = await columns[4].locator('button').all();
    expect(lastColumn.length, {
      message: 'There should be 3 buttons',
    }).toBe(3);

    inviteModal = await eventDetailsPage.clickEditButton(
      groupMock.inviteGroup,
      'New Family Name'
    );

    await inviteModal.waitToLoad();

    expect(await inviteModal.familyInput.inputValue()).toBe('New Family Name');
    expect(await inviteModal.getOptionSelected()).toBe(
      confirmedInviteMock.inviteGroup
    );
    expect(await inviteModal.entriesNumberInput.inputValue()).toBe('2');
    expect(await inviteModal.contactNumberInput.inputValue()).toBe(
      '9876543210'
    );
    expect(await inviteModal.kidsAllowedCheckbox.isChecked()).toBe(false);
  });

  test('should be able to copy the message', async ({ page, context }) => {
    // Grant clipboard permissions to browser context
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    // Open accordion
    await eventDetailsPage.clickAccordion(confirmedInviteMock.inviteGroup);

    await eventDetailsPage.clickCopyButton(
      confirmedInviteMock.inviteGroup,
      'New Family Name'
    );

    // Get clipboard content after the button has been clicked
    const handle = await page.evaluateHandle(() =>
      navigator.clipboard.readText()
    );
    const clipboardContent = await handle.jsonValue();

    expect(clipboardContent).toContain('http://localhost:4200/invites/');
  });

  test('should be able to delete an invite', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    // Open accordion
    await eventDetailsPage.clickAccordion(confirmedInviteMock.inviteGroup);

    const commonModal = await eventDetailsPage.clickDeleteButton(
      groupMock.inviteGroup,
      'New Family Name'
    );

    await commonModal.waitToLoad();
    await commonModal.clickConfirmButton();

    await eventDetailsPage.waitToLoad();
    expect(await eventDetailsPage.toastrIsShowing()).toBe(true);

    expect(await eventDetailsPage.getAccordionsCount(), {
      message: 'There should be no invite groups',
    }).toBe(0);

    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');
  });

  test('changing the event type to an incompatible one should show modal', async ({
    page,
  }) => {
    eventModal = await eventsPage.clickEditEventButton(0);
    await eventsPage.waitToLoad();

    await eventModal.setTypeOfEvent(EventType.Wedding);
    await eventModal.setNameOfCelebrated(
      saveTheDateUserInviteMock.nameOfCelebrated
    );

    await eventModal.clickConfirmButton();

    await eventsPage.waitToLoad();

    const commonModal = new CommonModal(page);
    expect(await commonModal.modalContent.textContent()).toContain(
      'You are changing the event type to one that is not supported, are you sure to override the New Event Name event? This will cause information captured by guests and the event settings to be deleted.'
    );
    await commonModal.clickConfirmButton();

    await eventsPage.waitToLoad();
    expect(await eventsPage.toastrIsShowing()).toBe(true);

    await eventsPage.clickEditEventButton(0);
    await eventsPage.waitToLoad();

    expect(await eventModal.typeOfEventInput.inputValue()).toBe(
      EventType.Wedding
    );
  });

  test(`changing the event type to a compatible one shouldn't show modal`, async ({
    page,
  }) => {
    eventModal = await eventsPage.clickEditEventButton(0);
    await eventsPage.waitToLoad();

    await eventModal.setTypeOfEvent(EventType.SaveTheDate);
    await eventModal.clickConfirmButton();
    await eventsPage.waitToLoad();
    expect(await eventsPage.toastrIsShowing()).toBe(true);

    const commonModal = new CommonModal(page);
    expect(await commonModal.isModalVisible()).toBe(false);

    await eventsPage.clickEditEventButton(0);
    await eventsPage.waitToLoad();

    expect(await eventModal.typeOfEventInput.inputValue()).toBe(
      EventType.SaveTheDate
    );
  });

  test('should be able to import invites', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    const inviteModal = await eventDetailsPage.clickImportInvitesButton();
    await inviteModal.waitToLoad();

    await inviteModal.uploadFile('import-invites.csv');
    await inviteModal.clickConfirmButton();

    await eventDetailsPage.waitToLoad();
    expect(await eventDetailsPage.toastrIsShowing()).toBe(true);

    expect(await eventDetailsPage.getAccordionsCount(), {
      message: 'There should be 2 invite groups',
    }).toBe(2);

    await eventDetailsPage.clickAccordion('Family Group');

    expect(await eventDetailsPage.getInviteGroupInviteCount('Family Group'), {
      message: 'There should be 1 invites in the Family Group',
    }).toBe(1);

    await eventDetailsPage.clickAccordion('Friends Group');

    expect(await eventDetailsPage.getInviteGroupInviteCount('Friends Group'), {
      message: 'There should be 1 invite in the Friends group',
    }).toBe(1);

    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('2');

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('2');
  });

  test('if the event date date is in the past, the invite buttons should be disabled', async () => {
    eventModal = await eventsPage.clickEditEventButton(0);
    await eventsPage.waitToLoad();

    await eventModal.setEventDate('2021-01-01');

    await eventModal.clickConfirmButton();
    await eventsPage.waitToLoad();
    expect(await eventsPage.toastrIsShowing()).toBe(true);

    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    expect(await eventDetailsPage.importInvites.isDisabled(), {
      message: 'Import invites button should be disabled',
    }).toBe(true);

    expect(await eventDetailsPage.newInvite.isDisabled(), {
      message: 'New invite button should be disabled',
    }).toBe(true);
  });
});

test.describe('Dashboard Events (Invites Admin)', () => {
  let eventsPage: EventsPage;
  let environmentCleaned = false;

  // Login as admin before each test
  test.beforeEach(async ({ page }) => {
    let loginPage = new LoginPage(page);
    await loginPage.goto();
    let dashboardPage;

    if (!environmentCleaned) {
      dashboardPage = await loginPage.loginAsAdmin();
      await dashboardPage.waitToLoad();
      await dashboardPage.clickTestingLink();
      const testingPage = new TestingPage(page);
      await testingPage.clickCleanEnvironmentButton();
      await testingPage.waitToLoad();
      loginPage = await testingPage.clickLogoutButton();
      environmentCleaned = true;
    }

    dashboardPage = await loginPage.login(
      invitesAdminUser.username,
      invitesAdminUser.password
    );
    await dashboardPage.waitToLoad();
    await dashboardPage.clickEventsLink();

    eventsPage = new EventsPage(page);
    await eventsPage.waitToLoad();
  });

  test(`shouldn't be able to see new event button but should be able to see the assigned events`, async ({
    page,
  }) => {
    expect(await eventsPage.isNewEventButtonVisible(), {
      message: 'New Event button should be visible',
    }).toBe(false);

    let loginPage = await eventsPage.clickLogoutButton();

    // Create event as admin and assign it to the invites admin user
    let dashboardPage = await loginPage.loginAsAdmin();
    await dashboardPage.waitToLoad();

    await dashboardPage.clickEventsLink();
    await dashboardPage.waitToLoad();

    const eventModal = await eventsPage.clickNewEventButton();
    await eventsPage.waitToLoad();

    await eventModal.fillEventForm(
      sweetXvEventMock.nameOfEvent,
      sweetXvEventMock.dateOfEvent,
      sweetXvEventMock.maxDateOfConfirmation,
      sweetXvEventMock.typeOfEvent,
      sweetXvEventMock.nameOfCelebrated,
      invitesAdminUser.username
    );

    await eventModal.clickConfirmButton();
    await eventsPage.waitToLoad();

    loginPage = await eventsPage.clickLogoutButton();

    dashboardPage = await loginPage.login(
      invitesAdminUser.username,
      invitesAdminUser.password
    );

    await dashboardPage.waitToLoad();
    await dashboardPage.clickEventsLink();
    await eventsPage.waitToLoad();

    eventsPage = new EventsPage(page);
    expect(await eventsPage.getEventCardsCount(), {
      message: 'There should be 1 event',
    }).toBe(1);

    const eventCard = eventsPage.getEventCard(0);
    expect(await eventCard.locator('h5').textContent()).toContain(
      sweetXvEventMock.nameOfEvent
    );
    expect(await eventCard.locator('p').textContent()).toContain(
      getFormattedDate(sweetXvEventMock.dateOfEvent.concat('T00:00:00'), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  });

  test('should be able to navigate to the event details page', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    await eventDetailsPage.isEventDetailsPage();
  });

  test('should be able to add new group to an invite', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    const inviteModal = await eventDetailsPage.clickNewInviteButton();
    await eventDetailsPage.waitToLoad();

    await inviteModal.clickAddNewGroupButton();
    await inviteModal.fillInviteGroupForm(groupMock.inviteGroup);

    await inviteModal.clickConfirmButton();
    await eventDetailsPage.waitToLoad();
    expect(await eventDetailsPage.toastrIsShowing()).toBe(true);

    const options = await inviteModal.getInviteGroupOptions();
    expect(options.includes(groupMock.inviteGroup)).toBe(true);
  });

  test('should be able to add new invite', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();
    const inviteModal = await eventDetailsPage.clickNewInviteButton();

    await inviteModal.fillInviteForm(
      confirmedInviteMock.family,
      confirmedInviteMock.inviteGroup,
      confirmedInviteMock.entriesNumber.toString(),
      confirmedInviteMock.contactNumber,
      confirmedInviteMock.kidsAllowed
    );

    await inviteModal.clickConfirmButton();

    await eventDetailsPage.waitToLoad();
    expect(await eventDetailsPage.toastrIsShowing()).toBe(true);

    expect(await eventDetailsPage.getAccordionsCount(), {
      message: 'There should be 1 invite group',
    }).toBe(1);

    expect(
      await eventDetailsPage.getInviteGroupInviteCount(
        confirmedInviteMock.inviteGroup
      ),
      {
        message: 'There should be 1 invite',
      }
    ).toBe(1);

    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('h5').textContent()).toContain(
      'Confirmed entries'
    );
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('h5').textContent()).toContain(
      'Pending entries'
    );
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      `${confirmedInviteMock.entriesNumber}`
    );

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('h5').textContent()).toContain(
      'Canceled entries'
    );
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('h5').textContent()).toContain(
      'Total entries'
    );
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      `${confirmedInviteMock.entriesNumber}`
    );

    // Open accordion
    await eventDetailsPage.clickAccordion(confirmedInviteMock.inviteGroup);

    const tableRow = await eventDetailsPage.getInviteRow(
      groupMock.inviteGroup,
      confirmedInviteMock.family
    );

    const columns = await tableRow.locator('td').all();

    expect(await columns[1].textContent(), {
      message: 'Family name should be ' + confirmedInviteMock.family,
    }).toBe(confirmedInviteMock.family);

    expect(await columns[2].textContent(), {
      message: `Entries number should be 0 / ${confirmedInviteMock.entriesNumber}`,
    }).toBe(`0 / ${confirmedInviteMock.entriesNumber}`);

    expect(await columns[3].textContent(), {
      message: 'Third column should be empty',
    }).toBe('');

    const lastColumn = await columns[4].locator('button').all();
    expect(lastColumn.length, {
      message: 'There should be 3 buttons',
    }).toBe(3);
  });

  test('should be able to edit an invite', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    // Open accordion
    await eventDetailsPage.clickAccordion(confirmedInviteMock.inviteGroup);

    let inviteModal = await eventDetailsPage.clickEditButton(
      groupMock.inviteGroup,
      confirmedInviteMock.family
    );

    await inviteModal.waitToLoad();

    expect(await inviteModal.familyInput.inputValue()).toBe(
      confirmedInviteMock.family
    );
    expect(await inviteModal.getOptionSelected()).toBe(
      confirmedInviteMock.inviteGroup
    );
    expect(await inviteModal.entriesNumberInput.inputValue()).toBe(
      confirmedInviteMock.entriesNumber.toString()
    );
    expect(await inviteModal.contactNumberInput.inputValue()).toBe(
      confirmedInviteMock.contactNumber
    );
    expect(await inviteModal.kidsAllowedCheckbox.isChecked()).toBe(
      confirmedInviteMock.kidsAllowed
    );

    await inviteModal.fillInviteForm(
      'New Family Name',
      groupMock.inviteGroup,
      '2',
      '9876543210',
      false
    );

    await inviteModal.clickConfirmButton();
    await eventDetailsPage.waitToLoad();
    expect(await eventDetailsPage.toastrIsShowing()).toBe(true);

    // Open accordion
    await eventDetailsPage.clickAccordion(confirmedInviteMock.inviteGroup);

    const tableRow = await eventDetailsPage.getInviteRow(
      groupMock.inviteGroup,
      'New Family Name'
    );

    const columns = await tableRow.locator('td').all();

    expect(await columns[1].textContent(), {
      message: 'Family name should be New Family Name',
    }).toBe('New Family Name');

    expect(await columns[2].textContent(), {
      message: `Entries number should be 0 / 2`,
    }).toBe(`0 / 2`);

    expect(await columns[3].textContent(), {
      message: 'Third column should be empty',
    }).toBe('');

    const lastColumn = await columns[4].locator('button').all();
    expect(lastColumn.length, {
      message: 'There should be 3 buttons',
    }).toBe(3);

    inviteModal = await eventDetailsPage.clickEditButton(
      groupMock.inviteGroup,
      'New Family Name'
    );

    await inviteModal.waitToLoad();

    expect(await inviteModal.familyInput.inputValue()).toBe('New Family Name');
    expect(await inviteModal.getOptionSelected()).toBe(
      confirmedInviteMock.inviteGroup
    );
    expect(await inviteModal.entriesNumberInput.inputValue()).toBe('2');
    expect(await inviteModal.contactNumberInput.inputValue()).toBe(
      '9876543210'
    );
    expect(await inviteModal.kidsAllowedCheckbox.isChecked()).toBe(false);
  });

  test('should be able to copy the message', async ({ page, context }) => {
    // Grant clipboard permissions to browser context
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    // Open accordion
    await eventDetailsPage.clickAccordion(confirmedInviteMock.inviteGroup);

    await eventDetailsPage.clickCopyButton(
      confirmedInviteMock.inviteGroup,
      'New Family Name'
    );

    // Get clipboard content after the button has been clicked
    const handle = await page.evaluateHandle(() =>
      navigator.clipboard.readText()
    );
    const clipboardContent = await handle.jsonValue();

    expect(clipboardContent).toContain('http://localhost:4200/invites/');
  });

  test('should be able to delete an invite', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    // Open accordion
    await eventDetailsPage.clickAccordion(confirmedInviteMock.inviteGroup);

    const commonModal = await eventDetailsPage.clickDeleteButton(
      groupMock.inviteGroup,
      'New Family Name'
    );

    await commonModal.waitToLoad();
    await commonModal.clickConfirmButton();

    await eventDetailsPage.waitToLoad();
    expect(await eventDetailsPage.toastrIsShowing()).toBe(true);

    expect(await eventDetailsPage.getAccordionsCount(), {
      message: 'There should be no invite groups',
    }).toBe(0);

    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');
  });

  test('should be able to import invites', async () => {
    const eventDetailsPage = await eventsPage.clickGoToInvitesButton(0);
    await eventDetailsPage.waitToLoad();

    const inviteModal = await eventDetailsPage.clickImportInvitesButton();
    await inviteModal.waitToLoad();

    await inviteModal.uploadFile('import-invites.csv');
    await inviteModal.clickConfirmButton();

    await eventDetailsPage.waitToLoad();
    expect(await eventDetailsPage.toastrIsShowing()).toBe(true);

    expect(await eventDetailsPage.getAccordionsCount(), {
      message: 'There should be 2 invite groups',
    }).toBe(2);

    await eventDetailsPage.clickAccordion('Family Group');

    expect(await eventDetailsPage.getInviteGroupInviteCount('Family Group'), {
      message: 'There should be 1 invites in the Family Group',
    }).toBe(1);

    await eventDetailsPage.clickAccordion('Friends Group');

    expect(await eventDetailsPage.getInviteGroupInviteCount('Friends Group'), {
      message: 'There should be 1 invite in the Friends group',
    }).toBe(1);

    // Check if the confirmed invites statistics are correct
    let eventCardStatistics = await eventDetailsPage.getEventCardStatistic(0);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the pending invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(1);
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      '15'
    );

    // Check if the cancelled invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(2);
    expect(await eventCardStatistics.locator('p').textContent()).toContain('0');

    // Check if the total invites statistics are correct
    eventCardStatistics = await eventDetailsPage.getEventCardStatistic(3);
    expect(await eventCardStatistics.locator('p').textContent()).toContain(
      '15'
    );
  });
});
