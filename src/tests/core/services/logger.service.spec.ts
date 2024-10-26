import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { logMock } from 'src/tests/mocks/mocks';

describe('Logger Service', () => {
  let loggerService: LoggerService;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LoggerService', ['getLogs']);

    TestBed.configureTestingModule({
      providers: [LoggerService, { provide: LoggerService, useValue: spy }],
    });

    loggerServiceSpy = TestBed.inject(
      LoggerService
    ) as jasmine.SpyObj<LoggerService>;
  });

  it('should be created', () => {
    loggerService = TestBed.inject(LoggerService);
    expect(loggerService)
      .withContext('Expected Logger Service to have been created')
      .toBeTruthy();
  });

  it('should call getLogs', () => {
    loggerServiceSpy.getLogs.and.returnValue(of([logMock]));

    loggerServiceSpy.getLogs().subscribe((response) => {
      expect(response).toEqual([logMock]);
    });

    expect(loggerServiceSpy.getLogs)
      .withContext('Expected getLogs to have been called')
      .toHaveBeenCalledOnceWith();
  });
});
