import { expect, Locator, Page } from '@playwright/test';
import { EventModal } from './event-modal';
import { DashboardPage } from 'e2e/pages/dashboard/dashboard-page';
import { EventDetailsPage } from './event-details/event-details-page';

export class EventsPage extends DashboardPage {
  readonly breadcrumbHeader: Locator;
  readonly newEventButton: Locator;
  readonly modal: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbHeader = page.locator('.breadcrumb-header li', {
      hasText: 'EVENTS',
    });

    this.newEventButton = page.locator('button', {
      hasText: 'New event',
    });
    this.modal = page.locator('#eventModal');
  }

  async isEventsPage() {
    await this.breadcrumbHeader.waitFor({ state: 'visible', timeout: 5000 });
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
    await this.waitToLoad();
    return new EventModal(this.page);
  }

  async isNewEventButtonVisible(): Promise<boolean> {
    return this.newEventButton.isVisible();
  }

  async getEventCardsCount(): Promise<number> {
    const eventCards = await this.page.locator('.events-container .card').all();
    return eventCards.length;
  }

  async getEventCard(index: number) {
    await this.page.waitForSelector('.events-container .card');
    return this.page.locator('.events-container .card').nth(index);
  }

  async clickEditEventButton(index: number) {
    const eventCard = await this.getEventCard(index);
    const button = eventCard.locator('button.edit-event');
    await button.click();
    await this.waitToLoad();

    return new EventModal(this.page);
  }

  async clickGoToInvitesButton(index: number, eventId: string) {
    const eventCard = await this.getEventCard(index);
    const button = eventCard.locator('a');
    await button.click();
    await this.waitToLoad();
    await this.page.waitForURL(`/dashboard/events/${eventId}`, {
      waitUntil: 'domcontentloaded',
    });

    return new EventDetailsPage(this.page);
  }
}
