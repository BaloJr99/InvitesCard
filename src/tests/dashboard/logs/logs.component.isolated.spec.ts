import { of } from 'rxjs';
import { ILog } from 'src/app/core/models/logs';
import { LogsComponent } from 'src/app/dashboard/logs/logs.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { logMock } from 'src/tests/mocks/mocks';

const logMockCopy = deepCopy(logMock);

describe('Logs Component (Isolated Test)', () => {
  let component: LogsComponent;

  beforeEach(() => {
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['getLogs']);
    loggerSpy.getLogs.and.returnValue(of([logMockCopy]));

    component = new LogsComponent(loggerSpy);
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
