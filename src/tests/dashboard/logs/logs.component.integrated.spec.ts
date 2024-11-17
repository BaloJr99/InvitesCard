import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { LogsModalComponent } from 'src/app/dashboard/logs/logs-modal/logs-modal.component';
import { LogsComponent } from 'src/app/dashboard/logs/logs.component';
import { logMock } from 'src/tests/mocks/mocks';

describe('Logs Component (Integrated Test)', () => {
  let fixture: ComponentFixture<LogsComponent>;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(waitForAsync(() => {
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['getLogs']);

    TestBed.configureTestingModule({
      declarations: [LogsComponent, LogsModalComponent],
      providers: [{ provide: LoggerService, useValue: loggerSpy }],
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

  it('should call getLogs on init', () => {
    expect(loggerServiceSpy.getLogs)
      .withContext('getLogs should have been called')
      .toHaveBeenCalled();
  });

  // TODO: Add table tests
});
