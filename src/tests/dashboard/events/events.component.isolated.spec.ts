import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { EventsComponent } from 'src/app/dashboard/events/events.component';

describe('Events Component (Isolated Test)', () => {
  let component: EventsComponent;
  const eventsSpy = jasmine.createSpyObj('EventsService', ['getEvents']);
  const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['']);

  beforeEach(() => {
    eventsSpy.getEvents.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        EventsComponent,
        { provide: EventsService, useValue: eventsSpy },
        { provide: TokenStorageService, useValue: tokenStorageSpy },
      ],
    });

    component = TestBed.createComponent(EventsComponent).componentInstance;
  });

  it('should create', () => {
    expect(component)
      .withContext('Component should have been created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.eventAction)
      .withContext('should have eventAction to be undefined')
      .toEqual({
        event: Object({
          id: '',
          nameOfEvent: '',
          dateOfEvent: '',
          maxDateOfConfirmation: '',
          nameOfCelebrated: '',
          eventTypeId: '',
          userId: '',
        }),
        isNew: true,
      });

    expect(component.showEventModal)
      .withContext('should have showEventModal to be false')
      .toBeFalse();
  });
});
