import { EventsComponent } from 'src/app/dashboard/events/events.component';

describe('Events Component (Isolated Test)', () => {
  let component: EventsComponent;

  beforeEach(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['']);

    component = new EventsComponent(eventsSpy, loaderSpy, tokenStorageSpy);
  });

  it('should create', () => {
    expect(component)
      .withContext('Component should have been created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.events)
      .withContext('should have events to be an empty array')
      .toEqual([]);

    expect(component.eventAction)
      .withContext('should have eventAction to be undefined')
      .toBeUndefined();

    expect(component.isAdmin)
      .withContext('should have isAdmin to be false')
      .toBeFalse();
  });
});
