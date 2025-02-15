import { of } from 'rxjs';
import { HomeComponent } from 'src/app/dashboard/home/home.component';

describe('Home Component (Isolated Test)', () => {
  let component: HomeComponent;

  beforeEach(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', [
      'getAllInvites',
    ]);
    invitesSpy.getAllInvites.and.returnValue(of([]));
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getDropdownEvents',
    ]);
    eventsSpy.getDropdownEvents.and.returnValue(of([]));

    component = new HomeComponent(invitesSpy, eventsSpy);
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
