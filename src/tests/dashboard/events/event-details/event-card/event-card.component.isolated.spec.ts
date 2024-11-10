import { EventCardComponent } from 'src/app/dashboard/events/event-details/event-card/event-card.component';

describe('Event Card Component (Isolated)', () => {
  let component: EventCardComponent;
  beforeEach(() => {
    component = new EventCardComponent();
  });

  it('should create', () => {
    expect(component)
      .withContext('EventCardComponent is not being created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.number).withContext('Event should be empty').toBe(0);
    expect(component.backgroundColor)
      .withContext('Background color should be white')
      .toBe('#ffffff');
    expect(component.displayText)
      .withContext('Display text should be empty')
      .toBe('');
  });
});
