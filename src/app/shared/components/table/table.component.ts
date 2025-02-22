import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import {
  IEmitAction,
  IFilter,
  IPageButtons,
  ITable,
  ITableStructure,
} from 'src/app/core/models/common';
import { ButtonAction, SelectAction } from 'src/app/core/models/enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: false,
})
export class TableComponent {
  containsData = false;
  dataShowing: { [key: string]: string }[] = [];

  @Input() set tableConfigurationValue(value: ITable | undefined) {
    if (value && Object.keys(value).length > 0) {
      this.containsData = value.data.length > 0;
      this.tableConfiguration.next(value);

      // Extract filters from the table configuration
      const filters = value.headers
        .filter((header) => header.filterable)
        .map(
          (header) =>
            ({
              value: '',
              filter: header.text,
            } as IFilter)
        );

      this.tableFilters.next(filters);
    }
  }

  @Output() actionResponse = new EventEmitter<IEmitAction>();

  private tableStructure = new BehaviorSubject<ITableStructure>({
    skip: 0,
    take: 10,
    sort: '',
    sortDirection: '',
  });
  tableStructure$ = this.tableStructure.asObservable();

  private tableFilters = new BehaviorSubject<IFilter[]>([]);
  tableFilters$ = this.tableFilters.asObservable();

  private tableConfiguration = new BehaviorSubject<ITable>({} as ITable);
  tableConfiguration$ = this.tableConfiguration.asObservable();

  vm$ = combineLatest([
    this.tableConfiguration,
    this.tableStructure$,
    this.tableFilters$,
  ]).pipe(
    map(([tableConfiguration, tableStructure, tableFilters]) => {
      const currentPage = tableStructure.skip + 1;

      let sortedArray = [...tableConfiguration.data];

      if (tableStructure.sort !== '') {
        const columnSorted = tableStructure.sort;
        const columnSortedDirection = tableStructure.sortDirection;

        sortedArray = sortedArray.sort((a, b) => {
          if (columnSortedDirection === 'asc') {
            return a[columnSorted] > b[columnSorted] ? 1 : -1;
          } else {
            return a[columnSorted] < b[columnSorted] ? 1 : -1;
          }
        });
      }

      // Apply filters to the array
      const activeFilters = tableFilters.filter((x) => x.value !== '');

      if (activeFilters.length > 0) {
        sortedArray = sortedArray.filter((row) =>
          activeFilters.every((filter) =>
            row[filter.filter]
              .toLowerCase()
              .includes(filter.value.toLowerCase())
          )
        );
      }

      const recordsToDisplay = sortedArray.slice(
        tableStructure.skip * tableStructure.take,
        tableStructure.skip * tableStructure.take + tableStructure.take
      );

      this.dataShowing = recordsToDisplay;

      const totalRecords = sortedArray.length;
      const showColSpan = Math.floor(tableConfiguration.headers.length / 2);
      const paginationSpan = tableConfiguration.headers.length - showColSpan;
      const numberOfPages = Math.ceil(sortedArray.length / 10);
      const pageNumberArray: IPageButtons[] = [];

      const lastPage = Math.ceil(totalRecords / tableStructure.take);

      // Show dots if we have more than 5 pages and we are not in the first 3 pages
      const showFirstDots = currentPage > 3 && numberOfPages > 5;
      // Show dots if we have more than 5 pages and we are not in the last 3 pages
      const showLastDots = currentPage < numberOfPages - 2 && numberOfPages > 5;

      // Add first page
      pageNumberArray.push({
        pageNumber: 1,
        accessibleText: $localize`Ir a la página 1`,
        isPage: true,
      });

      // Show dots if we have more than 5 pages and we are not in the first 3 pages
      if (showFirstDots) {
        pageNumberArray.push({
          pageNumber: 0,
          accessibleText: '',
          isPage: false,
        });
      }

      // Get the previous and next page to the current page
      const previousPageToAdd = currentPage - 1;
      const nextPageToAdd = currentPage + 1;

      // Add the 2 pages before the current page if we are in the last page
      if (previousPageToAdd > 1 && nextPageToAdd > lastPage) {
        pageNumberArray.push({
          pageNumber: previousPageToAdd - 1,
          accessibleText: $localize`Ir a la página ${previousPageToAdd - 1}`,
          isPage: true,
        });
      }

      // Add the previous and next page to the current page if it is not the first page
      if (previousPageToAdd > 1) {
        pageNumberArray.push({
          pageNumber: previousPageToAdd,
          accessibleText: $localize`Ir a la página ${previousPageToAdd}`,
          isPage: true,
        });
      }

      // Add the current page to the array if it is not already there
      if (!pageNumberArray.some((x) => x.pageNumber === currentPage)) {
        pageNumberArray.push({
          pageNumber: currentPage,
          accessibleText: $localize`Ir a la página ${currentPage}`,
          isPage: true,
        });
      }

      // Add the next page to the array if it is not the last page
      if (nextPageToAdd < lastPage) {
        pageNumberArray.push({
          pageNumber: nextPageToAdd,
          accessibleText: $localize`Ir a la página ${nextPageToAdd}`,
          isPage: true,
        });
      }

      // Add the next page if the previous page was the first page
      if (previousPageToAdd === 0 && nextPageToAdd < numberOfPages) {
        pageNumberArray.push({
          pageNumber: nextPageToAdd + 1,
          accessibleText: $localize`Ir a la página ${nextPageToAdd + 1}`,
          isPage: true,
        });
      }

      // Show dots if we have more than 5 pages and we are not in the last 3 pages
      if (showLastDots) {
        pageNumberArray.push({
          pageNumber: 0,
          accessibleText: '',
          isPage: false,
        });
      }

      // Add last page
      if (
        !pageNumberArray.some((x) => x.pageNumber === lastPage) &&
        lastPage > 1
      ) {
        pageNumberArray.push({
          pageNumber: lastPage,
          accessibleText: $localize`Ir a la página ${lastPage}`,
          isPage: true,
        });
      }

      return {
        recordsToDisplay,
        totalRecords,
        recordsShowing:
          tableStructure.skip * tableStructure.take + recordsToDisplay.length,
        firstRecord: this.containsData
          ? tableStructure.skip * tableStructure.take + 1
          : 0,
        showColSpan,
        paginationSpan,
        numberOfPages,
        showCheckbox: tableConfiguration.useCheckbox ?? false,
        isLastPage: this.containsData ? currentPage === numberOfPages : true,
        pageNumberArray,
        ...tableConfiguration,
        ...tableStructure,
      };
    })
  );

  onAction(action: string, row: number) {
    this.actionResponse.emit({
      action: action as ButtonAction,
      data: this.dataShowing[row],
    });
  }

  getAccessibilityMessage(name: string, isAll: boolean) {
    return isAll
      ? $localize`Seleccionar todos ${name}`
      : $localize`Seleccionar ${name}`;
  }

  selectAll(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.actionResponse.emit({
      action: SelectAction.SelectAll,
      data: {
        tableIndex: this.tableConfiguration.value.tableIndex.toString(),
        checked: target.checked.toString(),
      },
    });
  }

  selectRecord(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;

    this.actionResponse.emit({
      action: SelectAction.SelectRecord,
      data: {
        tableIndex: this.tableConfiguration.value.tableIndex.toString(),
        rowIndex: index.toString(),
        checked: target.checked.toString(),
      },
    });
  }

  allSelected(): boolean {
    try {
      return this.tableConfiguration.value.data.every((row) =>
        Boolean(JSON.parse(row['beingDeleted']))
      );
    } catch {
      return false;
    }
  }

  rowSelected(index: number): boolean {
    try {
      return Boolean(JSON.parse(this.dataShowing[index]['beingDeleted']));
    } catch {
      return false;
    }
  }

  showButtons(columnIndex: number): boolean {
    const buttons = this.tableConfiguration.value.buttons;
    const dataRowLength = this.tableConfiguration.value.headers.length;

    if (buttons && buttons.length > 0) {
      return columnIndex === dataRowLength - 1;
    }
    return false;
  }

  previousPage(): void {
    const currentPage = this.tableStructure.value.skip;
    this.tableStructure.next({
      ...this.tableStructure.value,
      skip: currentPage - 1,
    });
  }

  nextPage(): void {
    const currentPage = this.tableStructure.value.skip;
    this.tableStructure.next({
      ...this.tableStructure.value,
      skip: currentPage + 1,
    });
  }

  firstPage(): void {
    this.tableStructure.next({
      ...this.tableStructure.value,
      skip: 0,
    });
  }

  lastPage(): void {
    this.tableStructure.next({
      ...this.tableStructure.value,
      skip: Math.floor(
        this.tableConfiguration.value.data.length /
          this.tableStructure.value.take
      ),
    });
  }

  goToPage(index: number): void {
    this.tableStructure.next({
      ...this.tableStructure.value,
      skip: index,
    });
  }

  sortColumn(column: string): void {
    const columnSorted = this.tableStructure.value.sort;
    const currentSortDirection = this.tableStructure.value.sortDirection;

    if (columnSorted === '' || column !== columnSorted) {
      this.tableStructure.next({
        ...this.tableStructure.value,
        sort: `${column}`,
        sortDirection: 'asc',
      });
    } else if (currentSortDirection === 'asc') {
      this.tableStructure.next({
        ...this.tableStructure.value,
        sort: `${column}`,
        sortDirection: 'desc',
      });
    } else {
      this.tableStructure.next({
        ...this.tableStructure.value,
        sort: '',
        sortDirection: '',
      });
    }
  }

  showColumn(showCheckbox: boolean, columnIndex: number): boolean {
    return (
      ((showCheckbox && columnIndex !== 0) || !showCheckbox) &&
      !this.showButtons(columnIndex)
    );
  }

  filterData(filter: IFilter) {
    const filters = this.tableFilters.value;
    const filterIndex = filters.findIndex((x) => x.filter === filter.filter);

    if (filterIndex !== -1) {
      filters[filterIndex].value = filter.value;
    }
    // Reset the page to the first one
    this.tableStructure.next({
      ...this.tableStructure.value,
      skip: 0,
    });

    this.tableFilters.next(filters);
  }
}
