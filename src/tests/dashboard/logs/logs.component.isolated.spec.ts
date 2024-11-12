import { LogsComponent } from 'src/app/dashboard/logs/logs.component';

describe('Logs Component (Isolated Test)', () => {
  let component: LogsComponent;

  beforeEach(() => {
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['']);

    component = new LogsComponent(loggerSpy, loaderSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
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

    expect(component.dtOptions)
      .withContext('The dtOptions property should have the expected values')
      .toBeDefined();

    expect(component.dtTrigger)
      .withContext('The dtTrigger property should be defined')
      .toBeDefined();
  });

  // TODO: Add tests for table rendering
});
