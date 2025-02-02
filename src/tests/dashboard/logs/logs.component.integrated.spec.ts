import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { LogsModalComponent } from 'src/app/dashboard/logs/logs-modal/logs-modal.component';
import { LogsComponent } from 'src/app/dashboard/logs/logs.component';
import { FilterComponent } from 'src/app/shared/components/table/filter/filter.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { deepCopy, toLocalDate } from 'src/app/shared/utils/tools';
import { logMock } from 'src/tests/mocks/mocks';

const logMockCopy = deepCopy(logMock);

describe('Logs Component (Integrated Test)', () => {
  let fixture: ComponentFixture<LogsComponent>;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(waitForAsync(() => {
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['getLogs']);

    TestBed.configureTestingModule({
      declarations: [
        FilterComponent,
        LogsComponent,
        LogsModalComponent,
        TableComponent,
      ],
      providers: [{ provide: LoggerService, useValue: loggerSpy }],
    }).compileComponents();

    loggerServiceSpy = TestBed.inject(
      LoggerService
    ) as jasmine.SpyObj<LoggerService>;
  }));

  beforeEach(() => {
    loggerServiceSpy.getLogs.and.returnValue(of([{ ...logMockCopy }]));
    fixture = TestBed.createComponent(LogsComponent);
    fixture.detectChanges();
  });

  it('should call getLogs on init', () => {
    expect(loggerServiceSpy.getLogs)
      .withContext('getLogs should have been called')
      .toHaveBeenCalled();
  });

  it('should render a table with 1 row', () => {
    const tableComponent = fixture.debugElement.query(By.css('app-table'));
    const table = tableComponent.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));

    expect(table).withContext('table should be rendered').toBeTruthy();
    expect(rows.length).withContext('table should have 1 row').toBe(1);
  });

  it('should match the table content', () => {
    const tableComponent = fixture.debugElement.query(By.css('app-table'));
    const table = tableComponent.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));

    const cells = rows[0].queryAll(By.css('td'));

    expect(cells[0].nativeElement.innerHTML)
      .withContext('date should match')
      .toBe(toLocalDate(logMockCopy.dateOfError));

    expect(cells[1].nativeElement.innerHTML)
      .withContext('custom error should match')
      .toBe(logMockCopy.customError);

    expect(cells[2].nativeElement.innerHTML)
      .withContext('userId should match')
      .toBe(logMockCopy.userId);

    const button = cells[3].query(By.css('button'));
    expect(button).withContext('button should be rendered').toBeTruthy();
  });

  it('should call actionResponse on button click', () => {
    spyOn(fixture.componentInstance, 'actionResponse');

    const tableComponent = fixture.debugElement.query(By.css('app-table'));
    const table = tableComponent.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));

    const cells = rows[0].queryAll(By.css('td'));
    const button = cells[3].query(By.css('button'));

    button.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.actionResponse)
      .withContext('actionResponse should have been called')
      .toHaveBeenCalled();
  });
});
