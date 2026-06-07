import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';
import { UsersComponent } from 'src/app/dashboard/users/users.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { userEventsInfoMock } from 'src/tests/mocks/mocks';

const userEventsInfoMockCopy = deepCopy(userEventsInfoMock);

describe('Users Component (Isolated Test)', () => {
  let component: UsersComponent;
  const usersSpy = jasmine.createSpyObj('UsersService', ['getAllUsers']);
  const routerSpy = jasmine.createSpyObj('Router', ['']);

  beforeEach(() => {
    usersSpy.getAllUsers.and.returnValue(of([userEventsInfoMockCopy]));

    TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: usersSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    component = TestBed.createComponent(UsersComponent).componentInstance;
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
