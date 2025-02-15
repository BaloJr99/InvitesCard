import { of } from 'rxjs';
import { EventsComponent } from 'src/app/dashboard/events/events.component';

describe('Events Component (Isolated Test)', () => {
  let component: EventsComponent;

  beforeEach(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', ['getEvents']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['']);
    eventsSpy.getEvents.and.returnValue(of([]));

    component = new EventsComponent(eventsSpy, tokenStorageSpy);
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
          typeOfEvent: '',
          userId: '',
        }),
        isNew: true,
      });

    expect(component.showEventModal)
      .withContext('should have showEventModal to be false')
      .toBeFalse();
  });
});
