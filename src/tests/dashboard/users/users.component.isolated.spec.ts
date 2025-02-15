import { of } from 'rxjs';
import { UsersComponent } from 'src/app/dashboard/users/users.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { userEventsInfoMock } from 'src/tests/mocks/mocks';

const userEventsInfoMockCopy = deepCopy(userEventsInfoMock);

describe('Users Component (Isolated Test)', () => {
  let component: UsersComponent;

  beforeEach(() => {
    const usersSpy = jasmine.createSpyObj('UsersService', ['getAllUsers']);
    usersSpy.getAllUsers.and.returnValue(of([userEventsInfoMockCopy]));
    const routerSpy = jasmine.createSpyObj('Router', ['']);

    component = new UsersComponent(usersSpy, routerSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.roleSelected)
      .withContext('roleSelected should be undefined')
      .toBeUndefined();
    expect(component.savedUser)
      .withContext('savedUser should be undefined')
      .toBeUndefined();
  });
});
