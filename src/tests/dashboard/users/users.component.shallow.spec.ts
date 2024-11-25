import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';
import { UsersComponent } from 'src/app/dashboard/users/users.component';
import { userEventsInfoMock } from 'src/tests/mocks/mocks';

describe('Users Component (Shallow Test)', () => {
  let fixture: ComponentFixture<UsersComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(waitForAsync(() => {
    const usersSpy = jasmine.createSpyObj('UsersService', [
      'getAllUsers',
    ]);

    TestBed.configureTestingModule({
      declarations: [UsersComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: UsersService, useValue: usersSpy }],
    }).compileComponents();

    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
  }));

  beforeEach(() => {
    usersServiceSpy.getAllUsers.and.returnValue(of([userEventsInfoMock]));
    fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();
  });

  it('should have 2 buttons (add role and add user)', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.buttons button');
    expect(buttons.length).toBe(2);
  });

  it('should have an app-table component', () => {
    const appTable = fixture.nativeElement.querySelector('app-table');
    expect(appTable).withContext('app-table should be rendered').not.toBeNull();
  });
});