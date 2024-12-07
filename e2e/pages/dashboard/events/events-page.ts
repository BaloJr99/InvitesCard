import { expect, Locator, Page } from '@playwright/test';
import { EventModal } from './event-modal';
import { DashboardPage } from 'e2e/pages/dashboard/dashboard-page';
import { EventDetailsPage } from './event-details/event-details-page';

export class EventsPage extends DashboardPage {
  readonly breadcrumbHeader: Locator;
  readonly newEventButton: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbHeader = page.locator('.breadcrumb-header li', {
      hasText: 'EVENTOS',
    });

    this.newEventButton = page.locator('button', {
      hasText: 'New event',
    });
  }

  async isEventsPage() {
    expect(this.breadcrumbHeader, {
      message: 'Events breadcrumb should be visible',
    }).toBeVisible();
  }

  override async goto() {
    await super.goto('/dashboard/events');
    await this.isEventsPage();
  }

  async clickNewEventButton() {
    await this.newEventButton.click();
    return new EventModal(this.page);
  }

  async isNewEventButtonVisible(): Promise<boolean> {
    return this.newEventButton.isVisible();
  }

  async getEventCardsCount(): Promise<number> {
    const eventCards = await this.page.locator('.events-container .card').all();
    return eventCards.length;
  }

  getEventCard = (index: number) => {
    return this.page.locator('.events-container .card').nth(index);
  };

  async isEditEventButtonVisible(index: number): Promise<boolean> {
    const eventCard = this.getEventCard(index);
    const button = eventCard.locator('button.edit-event');

    return button.isVisible();
  }

  async clickEditEventButton(index: number) {
    const eventCard = this.getEventCard(index);
    const button = eventCard.locator('button.edit-event');
    await button.click();

    return new EventModal(this.page);
  }

  async clickGoToInvitesButton(index: number) {
    const eventCard = this.getEventCard(index);
    const button = eventCard.locator('a');
    await button.click();

    return new EventDetailsPage(this.page);
  }
}
