import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

describe('HomeComponent (Shallow Test)', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;

  const selectEvent = (eventId: string) => {
    const eventSelect = fixture.debugElement.query(By.css('#eventId'));

    eventSelect.nativeElement.value = eventId;
    eventSelect.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
  };

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

  it('should have a filter, two full-historical widgets and a last-invites widget', () => {
    const filter = fixture.debugElement.query(By.css('select'));
    const historySection = fixture.debugElement.query(By.css('.history'));
    const invitesHistory = historySection.queryAll(By.css('.invites-history'));
    const percentageHistory = historySection.queryAll(
      By.css('.percentage-history')
    );
    const lastInvitesChart = fixture.debugElement.query(
      By.css('.last-history')
    );

    expect(filter).withContext('Filter should be present').toBeTruthy();
    expect(invitesHistory)
      .withContext(
        'There should be two full-historical widgets 1.(invites-history)'
      )
      .toBeTruthy();

    expect(percentageHistory)
      .withContext(
        'There should be two full-historical widgets 2.(percentage-history)'
      )
      .toBeTruthy();
    expect(lastInvitesChart)
      .withContext('There should be a last-invites widget')
      .toBeTruthy();
  });

  it('should filter the invites by event', () => {
    spyOn(fixture.componentInstance, 'filterInvites');

    selectEvent(dropdownEventsMockCopy[0].id);

    expect(fixture.componentInstance.filterInvites)
      .withContext('filterInvites should have been called')
      .toHaveBeenCalled();
  });

  it('should render the charts when event', () => {
    spyOn(fixture.componentInstance, 'RenderChart');
    selectEvent(dropdownEventsMockCopy[0].id);

    const charts = fixture.debugElement.queryAll(By.css('canvas'));

    expect(charts.length).withContext('There should be 2 charts').toEqual(2);

    expect(fixture.componentInstance.RenderChart)
      .withContext('RenderChart should have been called')
      .toHaveBeenCalled();

    expect(fixture.componentInstance.lastInvitesChart)
      .withContext('Last invites chart have been created')
      .toBeDefined();

    expect(fixture.componentInstance.historyChart)
      .withContext('History chart have been created')
      .toBeDefined();
  });
});
