import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ITableButtons } from 'src/app/core/models/common';
import { InvitesService } from 'src/app/core/services/invites.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import {
  tableDataMock,
  tableDataWithButtonsMock,
  tableDataWithCheckboxMock,
  tableDataWithDisabledButtonsMock,
} from 'src/tests/mocks/mocks';

describe('Table Component (Shallow Test)', () => {
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    await TestBed.configureTestingModule({
      imports: [TableComponent],
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    fixture.componentRef.setInput('tableConfigurationValue', tableDataMock);
    fixture.detectChanges();
  });

  it('should create a table', () => {
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).not.toBeNull();
  });

  it('should create a table with thead and tbody', () => {
    const table = fixture.debugElement.query(By.css('table'));
    const thead = table.query(By.css('thead'));
    const tbody = table.query(By.css('tbody'));

    expect(thead).not.toBeNull();
    expect(tbody).not.toBeNull();
  });

  it('should match the headers', () => {
    const table = fixture.debugElement.query(By.css('table'));
    const headers = table.queryAll(By.css('thead th'));

    headers.forEach((header, index) => {
      expect(header.nativeElement.textContent).toContain(
        tableDataMock.headers[index].text
      );
    });
  });

  it('should create a table with 1 row', () => {
    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));

    expect(rows.length).withContext('Table should have 2 rows').toBe(2);
  });

  it('should create a table 1 button in each row', () => {
    fixture.componentRef.setInput(
      'tableConfigurationValue',
      tableDataWithButtonsMock
    );
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));
    const buttons = rows[0].queryAll(By.css('button'));

    expect(buttons.length).withContext('Table should have 1 button').toBe(1);
  });

  it('should create a table with the right content', () => {
    fixture.componentRef.setInput(
      'tableConfigurationValue',
      tableDataWithButtonsMock
    );
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));
    const columns = rows[0].queryAll(By.css('td'));

    expect(columns[0].nativeElement.innerHTML)
      .withContext(
        `First column should have ${
          tableDataMock.data[0][tableDataMock.headers[0].text]
        }`
      )
      .toContain(tableDataMock.data[0][tableDataMock.headers[0].text]);

    const buttons = columns[1].queryAll(By.css('button'));
    const mockedButtons = tableDataWithButtonsMock.buttons as ITableButtons[];
    expect(buttons[0].nativeElement.innerHTML)
      .withContext(`First button should have a ${mockedButtons[0].innerHtml}`)
      .toContain('Test');
  });

  it('should call onAction when row button is clicked', () => {
    spyOn(fixture.componentInstance, 'onAction');

    fixture.componentRef.setInput(
      'tableConfigurationValue',
      tableDataWithButtonsMock
    );
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));
    const button = rows[0].queryAll(By.css('button'));

    button[0].nativeElement.click();

    expect(fixture.componentInstance.onAction)
      .withContext('onAction should have been called')
      .toHaveBeenCalled();
  });

  it('should have all the buttons disabled', () => {
    fixture.componentRef.setInput(
      'tableConfigurationValue',
      tableDataWithDisabledButtonsMock
    );
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));
    const buttons = rows[0].queryAll(By.css('button'));

    buttons.forEach((button) => {
      expect(button.nativeElement.disabled)
        .withContext('Button should be disabled')
        .toBeTrue();
    });
  });

  it('should create a table 1 checkbox in each row', () => {
    fixture.componentRef.setInput(
      'tableConfigurationValue',
      tableDataWithCheckboxMock
    );
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));
    const input = rows[0].queryAll(By.css('input[type="checkbox"]'));

    expect(input.length).withContext('Table should have 1 checkbox').toBe(1);
  });

  it('should call selectAll when main checkbox is checked', () => {
    spyOn(fixture.componentInstance, 'selectAll');

    fixture.componentRef.setInput(
      'tableConfigurationValue',
      tableDataWithCheckboxMock
    );
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('thead tr'));
    const input = rows[0].queryAll(By.css('input[type="checkbox"]'));

    input[0].nativeElement.click();

    expect(fixture.componentInstance.selectAll)
      .withContext('selectAll should have been called')
      .toHaveBeenCalled();
  });

  it('should call selectRecord when row checkbox is checked', () => {
    spyOn(fixture.componentInstance, 'selectRecord');

    fixture.componentRef.setInput(
      'tableConfigurationValue',
      tableDataWithCheckboxMock
    );
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));
    const input = rows[0].queryAll(By.css('input[type="checkbox"]'));

    input[0].nativeElement.click();

    expect(fixture.componentInstance.selectRecord)
      .withContext('selectRecord should have been called')
      .toHaveBeenCalled();
  });

  it('should have 5 pagination buttons', () => {
    fixture.componentRef.setInput(
      'tableConfigurationValue',
      tableDataWithButtonsMock
    );
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('tfoot tr'));
    const buttons = rows[0].queryAll(By.css('button'));

    expect(buttons.length).withContext('Table should have 5 buttons').toBe(5);
  });

  it('should sort the table when a header is clicked', () => {
    spyOn(fixture.componentInstance, 'sortColumn');
    fixture.componentRef.setInput(
      'tableConfigurationValue',
      tableDataWithButtonsMock
    );
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('thead tr'));
    const headers = rows[0].queryAll(By.css('th'));
    const buttonHeader = headers[0].query(By.css('button'));
    buttonHeader.nativeElement.click();

    expect(fixture.componentInstance.sortColumn)
      .withContext('sortColumn should have been called')
      .toHaveBeenCalledOnceWith(tableDataWithButtonsMock.headers[0].text);
  });
});
