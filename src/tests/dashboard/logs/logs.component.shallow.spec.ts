import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { LogsComponent } from 'src/app/dashboard/logs/logs.component';
import { logMock } from 'src/tests/mocks/mocks';

describe('Logs Component (Shallow Test)', () => {
  let fixture: ComponentFixture<LogsComponent>;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(waitForAsync(() => {
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['getLogs']);

    TestBed.configureTestingModule({
      declarations: [LogsComponent],
      providers: [{ provide: LoggerService, useValue: loggerSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    loggerServiceSpy = TestBed.inject(
      LoggerService
    ) as jasmine.SpyObj<LoggerService>;
  }));

  beforeEach(() => {
    loggerServiceSpy.getLogs.and.returnValue(of([{ ...logMock }]));
    fixture = TestBed.createComponent(LogsComponent);
    fixture.detectChanges();
  });

  it('should render a card with a canvas, a table, two percentage history cards', () => {
    const historySection = fixture.debugElement.query(By.css('.history'));
    const card = historySection.query(By.css('.card'));
    const canvas = card.query(By.css('canvas'));
    const table = historySection.query(By.css('app-table'));
    const percentageCards = historySection.queryAll(
      By.css('.percentage-history .card')
    );

    expect(card).withContext('should render a card').toBeTruthy();
    expect(canvas).withContext('should render a canvas').toBeTruthy();
    expect(table).withContext('should render a table').toBeTruthy();
    expect(percentageCards.length)
      .withContext('should render two percentage history cards')
      .toBe(2);
  });
});
