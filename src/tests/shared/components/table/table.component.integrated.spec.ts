import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FilterComponent } from 'src/app/shared/components/table/filter/filter.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { tableDataWithFilterableHeaders } from 'src/tests/mocks/mocks';

describe('Table Component (Integrated Test)', () => {
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent, TableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    fixture.componentRef.setInput(
      'tableConfigurationValue',
      tableDataWithFilterableHeaders
    );
    fixture.detectChanges();
  });

  it('should filter the table data', () => {
    let table = fixture.debugElement.query(By.css('table'));
    let tableRows = table.queryAll(By.css('tbody tr'));

    // We should see all the data
    expect(tableRows.length).withContext('All rows should be visible').toBe(2);

    const headers = table.queryAll(By.css('th'));
    const filterButton = headers[0].query(By.css('button.filter'));
    filterButton.nativeElement.click();
    fixture.detectChanges();

    // We should be able to see the filter dialog
    let filterDialog = fixture.debugElement.query(
      By.css('.filter-dialog.show')
    );
    expect(filterDialog)
      .withContext('Filter dialog should be displaying')
      .toBeTruthy();

    const filterDialogInput = filterDialog.query(By.css('input'));
    filterDialogInput.nativeElement.value = '2';
    filterDialogInput.nativeElement.dispatchEvent(new Event('input'));

    const filterDialogButtons = filterDialog.queryAll(By.css('button'));
    const filterDialogApplyButton = filterDialogButtons[1];
    filterDialogApplyButton.nativeElement.click();

    fixture.detectChanges();

    filterDialog = fixture.debugElement.query(By.css('.filter-dialog.show'));

    table = fixture.debugElement.query(By.css('table'));
    tableRows = table.queryAll(By.css('tbody tr'));

    expect(tableRows.length)
      .withContext('Only one row should be visible')
      .toBe(1);
    expect(filterDialog)
      .withContext('Filter dialog should be hidden')
      .toBeFalsy();
  });
});
