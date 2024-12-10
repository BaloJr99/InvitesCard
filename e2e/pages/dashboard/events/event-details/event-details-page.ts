import { expect, Locator, Page } from '@playwright/test';
import { DashboardPage } from '../../dashboard-page';
import { InviteModal } from './invite-modal/invite-modal';
import { InviteImportModal } from './invites-import-modal/invites-import-modal';
import { TableHelper } from 'e2e/common/table';
import { CommonModal } from 'e2e/common/common-modal';

export class EventDetailsPage extends DashboardPage {
  readonly breadcrumbHeader: Locator;
  readonly importInvites: Locator;
  readonly newInvite: Locator;
  readonly filterByViewedSelect: Locator;
  readonly filterByNeedsAccomodationSelect: Locator;
  readonly filterByFamilySelect: Locator;
  readonly toggleMessagesButton: Locator;
  readonly notificationsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbHeader = page.locator('.breadcrumb li', {
      hasText: 'INVITES',
    });

    this.importInvites = this.page.locator('button', {
      hasText: 'Import invites',
    });
    this.newInvite = this.page.locator('button', {
      hasText: 'New invite',
    });

    this.filterByViewedSelect = this.page.locator('#filterByInviteViewed');
    this.filterByNeedsAccomodationSelect = this.page.locator(
      '#filterByNeedsAccomodation'
    );
    this.filterByFamilySelect = this.page.locator('#filterByFamily');

    this.toggleMessagesButton = this.page.locator('button.messages');
    this.notificationsButton = this.page.locator('button.notifications');
  }

  async isEventDetailsPage() {
    expect(this.breadcrumbHeader, {
      message: 'Event Details breadcrumb should be visible',
    }).toBeVisible();
  }

  async clickNewInviteButton() {
    await this.newInvite.click();
    return new InviteModal(this.page);
  }

  async clickImportInvitesButton() {
    await this.importInvites.click();
    return new InviteImportModal(this.page);
  }

  async clickToggleMessagesButton() {
    await this.toggleMessagesButton.click();
  }

  async clickNotificationsButton() {
    await this.notificationsButton.click();
  }

  async isToggleMessagesButtonVisible() {
    return this.toggleMessagesButton.isVisible();
  }

  async isNotificationsButtonVisible() {
    return this.notificationsButton.isVisible();
  }

  async setFilterByViewed(option: string) {
    await this.filterByViewedSelect.selectOption({ value: option });
  }

  async setFilterByNeedsAccomodation(option: string) {
    await this.filterByNeedsAccomodationSelect.selectOption({ value: option });
  }

  async setFilterByFamily(option: string) {
    await this.filterByFamilySelect.selectOption({ value: option });
  }

  async getAccordionsCount() {
    return this.page.locator('.accordion').count();
  }

  async clickDeleteInviteButton(index: number) {
    await this.page
      .locator('.accordion .accordion-body > button')
      .nth(index)
      .click();
  }

  async getInviteGroupInviteCount(inviteGroup: string) {
    const tableId = inviteGroup.replaceAll(/\s/g, '');
    const table = new TableHelper(this.page, tableId);

    return table.getRowsCount();
  }

  async getEventCardStatistic(index: number) {
    return this.page.locator('app-event-card').nth(index);
  }

  async clickAccordion(inviteGroup: string) {
    const accordionButton = this.page.getByRole('button', {
      name: inviteGroup,
    });

    await accordionButton.click();
  }

  async getInviteRow(inviteGroup: string, family: string) {
    const tableId = inviteGroup.replaceAll(/\s/g, '');
    const table = new TableHelper(this.page, tableId);

    expect(await table.getTableHeadersCount(), {
      message: 'Table headers count should be 5',
    }).toBe(5);

    return await table.getTableRowByColumn('Family', family);
  }

  async clickEditButton(inviteGroup: string, family: string) {
    const tableId = inviteGroup.replaceAll(/\s/g, '');
    const table = new TableHelper(this.page, tableId);

    // Get table row
    const tableRow = await table.getTableRowByColumn('Family', family);

    const columns = await tableRow.locator('td').all();
    const lastColumn = await columns[4].locator('button').all();

    // Click edit button
    await lastColumn[0].click();

    return new InviteModal(this.page);
  }

  async clickDeleteButton(inviteGroup: string, family: string) {
    const tableId = inviteGroup.replaceAll(/\s/g, '');
    const table = new TableHelper(this.page, tableId);

    // Get table row
    const tableRow = await table.getTableRowByColumn('Family', family);

    const columns = await tableRow.locator('td').all();
    const lastColumn = await columns[4].locator('button').all();

    // Click delete button
    await lastColumn[1].click();

    return new CommonModal(this.page);
  }

  async clickCopyButton(inviteGroup: string, family: string) {
    const tableId = inviteGroup.replaceAll(/\s/g, '');
    const table = new TableHelper(this.page, tableId);

    // Get table row
    const tableRow = await table.getTableRowByColumn('Family', family);

    const columns = await tableRow.locator('td').all();
    const lastColumn = await columns[4].locator('button').all();

    // Click copy button
    await lastColumn[2].click();
  }
}
