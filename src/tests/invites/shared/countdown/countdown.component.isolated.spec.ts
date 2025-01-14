import { CountdownComponent } from 'src/app/invites/shared/countdown/countdown.component';

describe('Countdown Component (Isolated Test)', () => {
  let component: CountdownComponent;

  beforeEach(() => {
    component = new CountdownComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.time$.value)
      .withContext(
        'The initial time should be 0 days, 0 hours, 0 minutes, 0 seconds'
      )
      .toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });

    expect(component.finishDate)
      .withContext('The finish date should be an instance of Date')
      .toBeInstanceOf(Date);

    expect(component.eventWasMet)
      .withContext('The eventWasMet should be false')
      .toBeFalse();
  });
});
