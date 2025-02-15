import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IDashboardEvent } from 'src/app/core/models/events';
import { EventsService } from 'src/app/core/services/events.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { EventsComponent } from 'src/app/dashboard/events/events.component';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { dashboardEventsMock, userMock } from 'src/tests/mocks/mocks';

const dashboardEventsMockCopy = deepCopy(dashboardEventsMock);
const userMockCopy = deepCopy(userMock);

describe('Events Component (Shallow Test)', () => {
  let fixture: ComponentFixture<EventsComponent>;
  let tokenStorageServiceSpy: jasmine.SpyObj<TokenStorageService>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  const eventsSubject = new BehaviorSubject<IDashboardEvent[]>([]);

  beforeEach(waitForAsync(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', ['getEvents']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', [
      'getTokenValues',
    ]);

    TestBed.configureTestingModule({
      declarations: [EventsComponent],
      imports: [DateFormatPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: EventsService, useValue: eventsSpy },
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        provideRouter([]),
      ],
    });

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;

    tokenStorageServiceSpy = TestBed.inject(
      TokenStorageService
    ) as jasmine.SpyObj<TokenStorageService>;
  }));

  beforeEach(() => {
    eventsServiceSpy.getEvents.and.returnValue(eventsSubject.asObservable());
    fixture = TestBed.createComponent(EventsComponent);
    fixture.detectChanges();
  });

  it('should create a page with not buttons if is not admin', () => {
    tokenStorageServiceSpy.getTokenValues.and.returnValue({
      ...userMockCopy,
      roles: [
        {
          id: '1',
          isActive: true,
          name: 'notAdmin',
        },
      ],
    });
    eventsSubject.next(dashboardEventsMockCopy);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });

  it('should create a page with one button if is admin', () => {
    tokenStorageServiceSpy.getTokenValues.and.returnValue(userMockCopy);
    eventsSubject.next(dashboardEventsMockCopy);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.buttons button'));
    expect(buttons.length).toBe(1);
  });

  it('should create a page with two event cards without edit button, only go to invite button', () => {
    tokenStorageServiceSpy.getTokenValues.and.returnValue({
      ...userMockCopy,
      roles: [
        {
          id: '1',
          isActive: true,
          name: 'notAdmin',
        },
      ],
    });
    eventsSubject.next(dashboardEventsMockCopy);
    fixture.detectChanges();

    const eventCards = fixture.debugElement.queryAll(By.css('.card'));
    expect(eventCards.length).toBe(2);

    eventCards.forEach((card) => {
      const editButton = card.query(By.css('.edit-event'));
      const goToInviteButton = card.query(By.css('.view-event'));
      expect(editButton).toBeNull();
      expect(goToInviteButton).toBeTruthy();
    });
  });

  it("should create a page with two event cards with edit buttons, only go to invite button if it's an admin", () => {
    tokenStorageServiceSpy.getTokenValues.and.returnValue(userMockCopy);
    eventsSubject.next(dashboardEventsMockCopy);
    fixture.detectChanges();

    const eventCards = fixture.debugElement.queryAll(By.css('.card'));
    expect(eventCards.length).toBe(2);

    eventCards.forEach((card) => {
      const editButton = card.query(By.css('.edit-event'));
      const goToInviteButton = card.query(By.css('.view-event'));
      expect(editButton).not.toBeNull();
      expect(goToInviteButton).toBeTruthy();
    });
  });
});
