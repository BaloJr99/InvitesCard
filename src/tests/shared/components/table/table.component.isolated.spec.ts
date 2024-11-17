import { ITable } from 'src/app/core/models/common';
import { TableComponent } from 'src/app/shared/components/table/table.component';

describe('Table Component (Isolated Test)', () => {
  let component: TableComponent;

  beforeEach(() => {
    component = new TableComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render initial values', () => {
    expect(component.tableConfiguration)
      .withContext('tableConfiguration should be an empty object')
      .toEqual({} as ITable);

    expect(component.recordsToDisplay)
      .withContext('recordsToDisplay should be an empty array')
      .toEqual([]);

    expect(component.totalRecords)
      .withContext('totalRecords should be 0')
      .toBe(0);

    expect(component.recordsShowing)
      .withContext('recordsShowing should be 0')
      .toBe(0);

    expect(component.step).withContext('step should be 10').toBe(10);

    expect(component.currentPage)
      .withContext('currentPage should be 1')
      .toBe(1);

    expect(component.firstRecord)
      .withContext('firstRecord should be 0')
      .toBe(0);

    expect(component.showColSpan)
      .withContext('showColSpan should be 0')
      .toBe(0);

    expect(component.paginationSpan)
      .withContext('paginationSpan should be 0')
      .toBe(0);

    expect(component.numberOfPages)
      .withContext('numberOfPages should be 0')
      .toBe(0);

    expect(component.pageNumberArray)
      .withContext('pageNumberArray should be an empty array')
      .toEqual([]);
  });
});
