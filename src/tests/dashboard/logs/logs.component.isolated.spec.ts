import { ITable, ITableHeaders } from 'src/app/core/models/common';
import { LogsComponent } from 'src/app/dashboard/logs/logs.component';

describe('Logs Component (Isolated Test)', () => {
  let component: LogsComponent;

  beforeEach(() => {
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['']);
    const localeId = 'en-US';

    component = new LogsComponent(loggerSpy, loaderSpy, localeId);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.logs)
      .withContext('The logs property should be an empty array')
      .toEqual([]);

    expect(component.table)
      .withContext('The table property should be an empty object')
      .toEqual({
        headers: [] as ITableHeaders[],
        data: [] as { [key: string]: string }[],
      } as ITable);

    expect(component.logSelected)
      .withContext('The logSelected property should undefined')
      .toBeUndefined();

    expect(component.numberOfErrorsLast31Days)
      .withContext('The numberOfErrorsLast31Days property should be 0')
      .toBe(0);

    expect(component.numberOfErrorsToday)
      .withContext('The numberOfErrorsToday property should be 0')
      .toBe(0);

    expect(component.groupedByDate)
      .withContext('The groupedByDate property should be an empty object')
      .toEqual({});
  });
});
