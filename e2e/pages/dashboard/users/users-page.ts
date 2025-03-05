import { expect, Locator, Page } from '@playwright/test';
import { DashboardPage } from '../dashboard-page';
import { RoleModal } from './user-role-modal/user-role-modal';
import { UserModal } from './user-modal/user-modal';
import { TableHelper } from 'e2e/common/table';

export class UsersPage extends DashboardPage {
  readonly breadcrumbHeader: Locator;
  readonly newRoleButton: Locator;
  readonly newUserButton: Locator;

  constructor(page: Page) {
    super(page);

    this.breadcrumbHeader = page.locator('.breadcrumb li', {
      hasText: 'USERS',
    });

    this.newRoleButton = this.page.locator('button', {
      hasText: 'New Role',
    });

    this.newUserButton = this.page.locator('button', {
      hasText: 'New User',
    });
  }

  async isUsersPage() {
    await this.breadcrumbHeader.waitFor({ state: 'visible', timeout: 5000 });
    expect(this.breadcrumbHeader, {
      message: 'Users breadcrumb should be visible',
    }).toBeVisible();
  }

  async clickNewRoleButton() {
    await this.newRoleButton.click();
    return new RoleModal(this.page);
  }

  async clickNewUserButton() {
    await this.newUserButton.click();
    return new UserModal(this.page);
  }

  async getUserRow(user: string) {
    const table = new TableHelper(this.page, 'usersTable');
    return table.getTableRowByColumn('Username', user);
  }
}
