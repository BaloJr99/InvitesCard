import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { HomeComponent } from 'src/app/dashboard/home/home.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  dashboardInvitesMock,
  dropdownEventsMock,
} from 'src/tests/mocks/mocks';

const dashboardInvitesMockCopy = deepCopy(dashboardInvitesMock);
const dropdownEventsMockCopy = deepCopy(dropdownEventsMock);

describe('HomeComponent (Integrated Test)', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;

  beforeEach(async () => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', [
      'getAllInvites',
    ]);
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getDropdownEvents',
    ]);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        { provide: EventsService, useValue: eventsSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;
    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;

    eventsServiceSpy.getDropdownEvents.and.returnValue(
      of(dropdownEventsMockCopy)
    );
    invitesServiceSpy.getAllInvites.and.returnValue(
      of([{ ...dashboardInvitesMockCopy }])
    );

    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });

  it('should call getAllInvites and getDropdownEvents on init', () => {
    expect(invitesServiceSpy.getAllInvites)
      .withContext('should call getAllInvites on init')
      .toHaveBeenCalledTimes(1);

    expect(eventsServiceSpy.getDropdownEvents)
      .withContext('should call getDropdownEvents on init')
      .toHaveBeenCalledTimes(1);
  });
});
