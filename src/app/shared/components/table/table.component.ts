import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEmitAction, IPageButtons, ITable } from 'src/app/core/models/common';
import { ButtonAction, SelectAction } from 'src/app/core/models/enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  tableConfiguration: ITable = {} as ITable;
  recordsToDisplay: { [key: string]: string }[] = [];
  totalRecords: number = 0;
  recordsShowing: number = 0;

  step: number = 10;

  currentPage: number = 1;
  firstRecord: number = 0;
  showColSpan = 0;
  paginationSpan = 0;

  numberOfPages = 0;
  pageNumberArray: IPageButtons[] = [];

  @Input() set tableConfigurationValue(value: ITable | undefined) {
    if (value) {
      this.tableConfiguration = value;
      this.numberOfPages = Math.ceil(value.data.length / this.step);
      this.totalRecords = this.tableConfiguration.data.length;

      this.calculatePagination();

      this.showColSpan = Math.floor(this.tableConfiguration.headers.length / 2);
      this.paginationSpan =
        this.tableConfiguration.headers.length - this.showColSpan;
    }
  }

  @Output() actionResponse = new EventEmitter<IEmitAction>();

  constructor() {}

  onAction(action: string, row: number) {
    this.actionResponse.emit({
      action: action as ButtonAction,
      data: this.tableConfiguration.data[row],
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
        tableIndex: this.tableConfiguration.tableIndex.toString(),
        checked: target.checked.toString(),
      },
    });
  }

  selectRecord(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;

    this.actionResponse.emit({
      action: SelectAction.SelectRecord,
      data: {
        tableIndex: this.tableConfiguration.tableIndex.toString(),
        rowIndex: index.toString(),
        checked: target.checked.toString(),
      },
    });
  }

  allSelected(): boolean {
    try {
      return this.tableConfiguration.data.every((row) =>
        Boolean(JSON.parse(row['beingDeleted']))
      );
    } catch {
      return false;
    }
  }

  rowSelected(index: number): boolean {
    try {
      return Boolean(
        JSON.parse(this.tableConfiguration.data[index]['beingDeleted'])
      );
    } catch {
      return false;
    }
  }

  showCheckbox(): boolean {
    return this.tableConfiguration.useCheckbox ?? false;
  }

  showButtons(columnIndex: number): boolean {
    const hasButtons =
      (this.tableConfiguration.buttons &&
        this.tableConfiguration.buttons.length > 0) ??
      false;
    const dataRowLength = this.tableConfiguration.headers.length;
    return columnIndex === dataRowLength - 1 && hasButtons;
  }

  showRow(columnIndex: number): boolean {
    return (
      ((this.showCheckbox() && columnIndex !== 0) || !this.showCheckbox()) &&
      !this.showButtons(columnIndex)
    );
  }

  calculateRecordsToDisplay(): void {
    this.recordsToDisplay = this.tableConfiguration.data.slice(
      (this.currentPage - 1) * this.step,
      (this.currentPage - 1) * this.step + this.step
    );
  }

  calculatePagination(): void {
    this.firstRecord = (this.currentPage - 1) * this.step + 1;
    this.calculateRecordsToDisplay();
    this.recordsShowing =
      (this.currentPage - 1) * this.step + this.recordsToDisplay.length;

    this.calculatePageNumberArray();
  }

  calculatePageNumberArray(): void {
    this.pageNumberArray = [];
    const lastPage = Math.ceil(this.totalRecords / this.step);

    // Show dots if we have more than 5 pages and we are not in the first 3 pages
    const showFirstDots = this.currentPage > 3 && this.numberOfPages > 5;
    // Show dots if we have more than 5 pages and we are not in the last 3 pages
    const showLastDots =
      this.currentPage < this.numberOfPages - 2 && this.numberOfPages > 5;

    // Add first page
    this.pageNumberArray.push({
      pageNumber: 1,
      accessibleText: $localize`Ir a la página 1`,
      isPage: true,
    });

    // Show dots if we have more than 5 pages and we are not in the first 3 pages
    if (showFirstDots) {
      this.pageNumberArray.push({
        pageNumber: 0,
        accessibleText: '',
        isPage: false,
      });
    }

    // Get the previous and next page to the current page
    const previousPageToAdd = this.currentPage - 1;
    const nextPageToAdd = this.currentPage + 1;

    // Add the 2 pages before the current page if we are in the last page
    if (previousPageToAdd > 1 && nextPageToAdd > lastPage) {
      this.pageNumberArray.push({
        pageNumber: previousPageToAdd - 1,
        accessibleText: $localize`Ir a la página ${previousPageToAdd - 1}`,
        isPage: true,
      });
    }

    // Add the previous and next page to the current page if it is not the first page
    if (previousPageToAdd > 1) {
      this.pageNumberArray.push({
        pageNumber: previousPageToAdd,
        accessibleText: $localize`Ir a la página ${previousPageToAdd}`,
        isPage: true,
      });
    }

    // Add the current page to the array if it is not already there
    if (!this.pageNumberArray.some((x) => x.pageNumber === this.currentPage)) {
      this.pageNumberArray.push({
        pageNumber: this.currentPage,
        accessibleText: $localize`Ir a la página ${this.currentPage}`,
        isPage: true,
      });
    }

    // Add the next page to the array if it is not the last page
    if (nextPageToAdd < lastPage) {
      this.pageNumberArray.push({
        pageNumber: nextPageToAdd,
        accessibleText: $localize`Ir a la página ${nextPageToAdd}`,
        isPage: true,
      });
    }

    // Add the next page if the previous page was the first page
    if (previousPageToAdd === 0 && nextPageToAdd < this.numberOfPages) {
      this.pageNumberArray.push({
        pageNumber: nextPageToAdd + 1,
        accessibleText: $localize`Ir a la página ${nextPageToAdd + 1}`,
        isPage: true,
      });
    }

    // Show dots if we have more than 5 pages and we are not in the last 3 pages
    if (showLastDots) {
      this.pageNumberArray.push({
        pageNumber: 0,
        accessibleText: '',
        isPage: false,
      });
    }

    // Add last page
    if (!this.pageNumberArray.some((x) => x.pageNumber === lastPage)) {
      this.pageNumberArray.push({
        pageNumber: lastPage,
        accessibleText: $localize`Ir a la página ${lastPage}`,
        isPage: true,
      });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.calculatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.numberOfPages) {
      this.currentPage++;
      this.calculatePagination();
    }
  }

  firstPage(): void {
    this.currentPage = 1;
    this.calculatePagination();
  }

  lastPage(): void {
    this.currentPage = this.numberOfPages;
    this.calculatePagination();
  }

  isLastPage(): boolean {
    return this.currentPage === this.numberOfPages;
  }

  goToPage(index: number): void {
    this.currentPage = this.pageNumberArray[index].pageNumber;
    this.calculatePagination();
  }
}
