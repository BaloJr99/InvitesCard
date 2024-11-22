import { ITable } from 'src/app/core/models/common';
import { UsersComponent } from 'src/app/dashboard/users/users.component';

describe('Users Component (Isolated Test)', () => {
  let component: UsersComponent;

  beforeEach(() => {
    const usersSpy = jasmine.createSpyObj('UsersService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const routerSpy = jasmine.createSpyObj('Router', ['']);

    component = new UsersComponent(usersSpy, loaderSpy, routerSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.users)
      .withContext('users should be an empty array')
      .toEqual([]);
    expect(component.userAction)
      .withContext('userAction should be undefined')
      .toBeUndefined();
    expect(component.roleSelected)
      .withContext('roleSelected should be undefined')
      .toBeUndefined();
    expect(component.savedUser)
      .withContext('savedUser should be undefined')
      .toBeUndefined();
    expect(component.table)
      .withContext('table should be an empty object')
      .toEqual({} as ITable);
  });
});
