import { Locator, Page } from '@playwright/test';

export class TableHelper {
  readonly page: Page;
  readonly tableId: string;
  readonly table: Locator;

  constructor(page: Page, tableId: string) {
    this.page = page;
    this.tableId = tableId;
    this.table = page.locator(`#${tableId}`);
  }

  async getTableHeaders() {
    return this.table.locator('thead tr th span').all();
  }

  async getTableHeadersCount() {
    return this.table.locator('thead tr th').count();
  }

  async getRowsCount() {
    return this.table.locator('tbody tr').count();
  }

  async getTableRowByColumn(columnHeader: string, textContent: string) {
    const headers = await this.getTableHeaders();
    let headerIndex = headers.findIndex(async (header) => {
      return (await header.textContent()) === columnHeader;
    });

    if (headers.length !== (await this.getTableHeadersCount())) {
      headerIndex++;
    }

    const rows = await this.table.locator('tbody tr').all();

    let rowFound = null;
    for (const row of rows) {
      const cell = row.locator('td').nth(headerIndex);
      if ((await cell.textContent()) === textContent) {
        rowFound = row;
      }
    }

    if (!rowFound) {
      throw new Error(`Row with ${columnHeader} ${textContent} not found`);
    }
    return rowFound;
  }

  async getTableRowByIndex(rowIndex: number) {
    const rows = await this.table.locator('tbody tr').all();
    return rows[rowIndex];
  }

  async getTableHeader(index: number) {
    return this.table.locator('thead tr th').nth(index);
  }

  async getTableCell(row: number, column: number) {
    return this.table.locator('tbody tr').nth(row).locator('td').nth(column);
  }
}
