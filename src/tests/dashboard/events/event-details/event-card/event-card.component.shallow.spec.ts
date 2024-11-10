import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventCardComponent } from 'src/app/dashboard/events/event-details/event-card/event-card.component';

describe('Event Card Component (Shallow Test)', () => {
  let fixture: ComponentFixture<EventCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCardComponent);
    fixture.detectChanges();
  });

  it('should create a card with card-body, card-title, card-text', () => {
    const cardBody = fixture.debugElement.query(By.css('.card-body'));
    const cardTitle = fixture.debugElement.query(By.css('.card-title'));
    const cardText = fixture.debugElement.query(By.css('.card-text'));

    expect(cardBody).withContext("Card Body shouldn't be null").not.toBeNull();

    expect(cardTitle)
      .withContext("Card Title shouldn't be null")
      .not.toBeNull();

    expect(cardText).withContext("Card Text shouldn't be null").not.toBeNull();
  });

  it('should change the background color to red', () => {
    fixture.componentInstance.backgroundColor = '#ff0000';
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('.card'));

    expect(card.nativeElement.style.backgroundColor)
      .withContext('Background color should be red')
      .toBe('rgb(255, 0, 0)');
  });

  it('should change the display text to "Hello World"', () => {
    fixture.componentInstance.displayText = 'Hello World';
    fixture.detectChanges();

    const cardTitle = fixture.debugElement.query(By.css('.card-title'));

    expect(cardTitle.nativeElement.textContent)
      .withContext('Display text should be "Hello World"')
      .toBe('Hello World');
  });

  it('should change the number to 5', () => {
    fixture.componentInstance.number = 5;
    fixture.detectChanges();

    const cardText = fixture.debugElement.query(By.css('.card-text'));

    expect(cardText.nativeElement.innerHTML)
      .withContext('Number should be 5')
      .toEqual('5');
  });
});
