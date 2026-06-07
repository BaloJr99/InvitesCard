import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ILog } from 'src/app/core/models/logs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { LogsComponent } from 'src/app/dashboard/logs/logs.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { logMock } from 'src/tests/mocks/mocks';

const logMockCopy = deepCopy(logMock);

describe('Logs Component (Isolated Test)', () => {
  let component: LogsComponent;
  const loggerSpy = jasmine.createSpyObj('LoggerService', ['getLogs']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

  beforeEach(() => {
    loggerSpy.getLogs.and.returnValue(of([logMockCopy]));

    TestBed.configureTestingModule({
      providers: [
        { provide: LoggerService, useValue: loggerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    });

    component = TestBed.createComponent(LogsComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.logSelected)
      .withContext('The logSelected property should undefined')
      .toEqual({} as ILog);
  });
});
