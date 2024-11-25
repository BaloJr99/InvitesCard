import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { HomeComponent } from 'src/app/dashboard/home/home.component';
import {
  dashboardInvitesMock,
  dropdownEventsMock,
} from 'src/tests/mocks/mocks';

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

  beforeEach(waitForAsync(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', [
      'getAllInvites',
    ]);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['setLoading']);
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getDropdownEvents',
    ]);

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        { provide: LoaderService, useValue: loaderSpy },
        { provide: EventsService, useValue: eventsSpy },
      ],
    }).compileComponents();

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;
    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;
  }));

  beforeEach(() => {
    eventsServiceSpy.getDropdownEvents.and.returnValue(of(dropdownEventsMock));
    invitesServiceSpy.getAllInvites.and.returnValue(
      of([{ ...dashboardInvitesMock }])
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

    selectEvent(dropdownEventsMock[0].id);

    expect(fixture.componentInstance.filterInvites)
      .withContext('filterInvites should have been called')
      .toHaveBeenCalled();
  });

  it('should render the charts when event', () => {
    spyOn(fixture.componentInstance, 'RenderChart');
    selectEvent(dropdownEventsMock[0].id);

    const charts = fixture.debugElement.queryAll(By.css('canvas'));

    expect(charts.length).withContext('There should be 2 charts').toEqual(2);

    expect(fixture.componentInstance.RenderChart)
      .withContext('RenderChart should have been called')
      .toHaveBeenCalled();

    expect(fixture.componentInstance.statistics)
      .withContext('Statistics should have been updated')
      .toEqual([
        { name: 'Pases Confirmados', value: 2, color: '#4CAF50' },
        { name: 'Pases Pendientes', value: 0, color: '#FFC107' },
        { name: 'Pases Cancelados', value: 0, color: '#F44336' },
        { name: 'Total de Pases', value: 2, color: '#2196F3' },
      ]);

    expect(fixture.componentInstance.percentajeOfConfirmation)
      .withContext('Percentage of confirmation should have been updated')
      .toEqual('100');

    expect(fixture.componentInstance.percentajeOfPendingResponse)
      .withContext('Percentage of pending response should have been updated')
      .toEqual('0');

    const groupedByDateMock: { [key: string]: number } = {};
    groupedByDateMock[`${dashboardInvitesMock.dateOfConfirmation}`] = 1;

    expect(fixture.componentInstance.groupedByDate)
      .withContext('Grouped by date should have been updated')
      .toEqual(groupedByDateMock);

    expect(fixture.componentInstance.lastInvitesChart)
      .withContext('Last invites chart have been created')
      .toBeDefined();

    expect(fixture.componentInstance.historyChart)
      .withContext('History chart have been created')
      .toBeDefined();
  });
});