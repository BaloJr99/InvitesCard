import { CountdownComponent } from 'src/app/entries/countdown/countdown.component'

describe('CountdownComponent', () => {
  let component: CountdownComponent;
  const finishDate = new Date('2023-11-18:19:00:00');
  const initialTimer = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  beforeEach(() => {
    component = new CountdownComponent();
  })

  it('init date should be 2023-11-18:19:00:00', () => {
    expect(component.finishDate).toEqual(finishDate);
  })
  
  it('init time should be set to 0', () => {
    component.time$.subscribe({
      next: (value) => {
        expect(value).toEqual(initialTimer);
      }
    });
  })
})