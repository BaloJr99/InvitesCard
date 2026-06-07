import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { HomeComponent } from 'src/app/dashboard/home/home.component';

describe('Home Component (Isolated Test)', () => {
  let component: HomeComponent;
  const invitesSpy = jasmine.createSpyObj('InvitesService', [
    'getAllInvites',
  ]);
  const eventsSpy = jasmine.createSpyObj('EventsService', [
    'getDropdownEvents',
  ]);

  beforeEach(() => {
    invitesSpy.getAllInvites.and.returnValue(of([]));
    eventsSpy.getDropdownEvents.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        { provide: EventsService, useValue: eventsSpy },
      ],
    });
    component = TestBed.createComponent(HomeComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.lastInvitesChart)
      .withContext('should have lastInvitesChart to be undefined')
      .toBeUndefined();

    expect(component.historyChart)
      .withContext('should have historyChart to be undefined')
      .toBeUndefined();
  });
});
