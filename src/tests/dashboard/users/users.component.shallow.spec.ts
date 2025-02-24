import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';
import { UsersComponent } from 'src/app/dashboard/users/users.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { userEventsInfoMock } from 'src/tests/mocks/mocks';

const userEventsInfoMockCopy = deepCopy(userEventsInfoMock);

describe('Users Component (Shallow Test)', () => {
  let fixture: ComponentFixture<UsersComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(waitForAsync(() => {
    const usersSpy = jasmine.createSpyObj('UsersService', ['getAllUsers']);

    TestBed.configureTestingModule({
      imports: [UsersComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: UsersService, useValue: usersSpy },
        provideRouter([]),
        provideHttpClient(),
        importProvidersFrom(
          ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
          })
        ),
      ],
    }).compileComponents();

    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
  }));

  beforeEach(() => {
    usersServiceSpy.getAllUsers.and.returnValue(of([userEventsInfoMockCopy]));
    fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();
  });

  it('should have 2 buttons (add role and add user)', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.buttons button');
    expect(buttons[0].textContent).toBe('Nuevo rol');
    expect(buttons[1].textContent).toBe('Nuevo usuario');
  });

  it('should have an app-table component', () => {
    const appTable = fixture.nativeElement.querySelector('app-table');
    expect(appTable).withContext('app-table should be rendered').not.toBeNull();
  });
});
