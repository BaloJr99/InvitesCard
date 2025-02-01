import { HomeComponent } from 'src/app/dashboard/home/home.component';

describe('Home Component (Isolated Test)', () => {
  let component: HomeComponent;

  beforeEach(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const eventsSpy = jasmine.createSpyObj('EventsService', ['']);
    const localeId = 'en-US';

    component = new HomeComponent(invitesSpy, loaderSpy, eventsSpy, localeId);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.invites)
      .withContext('should have invites to be an empty array')
      .toEqual([]);

    expect(component.statistics)
      .withContext('should have statistics to be an empty array')
      .toEqual([]);

    expect(component.percentajeOfConfirmation)
      .withContext('should have percentajeOfConfirmation to be 0')
      .toBe('0');

    expect(component.percentajeOfPendingResponse)
      .withContext('should have percentajeOfPendingResponse to be 0')
      .toBe('0');

    expect(component.groupedByDate)
      .withContext('should have groupedByDate to be an empty object')
      .toEqual({});

    expect(component.events)
      .withContext('should have events to be an empty array')
      .toEqual([]);

    expect(component.eventSelected)
      .withContext('should have eventSelected to be an empty string')
      .toBe('');

    expect(component.lastInvitesChart)
      .withContext('should have lastInvitesChart to be undefined')
      .toBeUndefined();

    expect(component.historyChart)
      .withContext('should have historyChart to be undefined')
      .toBeUndefined();
  });
});
