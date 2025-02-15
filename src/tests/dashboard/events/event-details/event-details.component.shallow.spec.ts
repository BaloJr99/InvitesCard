import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { EventsService } from 'src/app/core/services/events.service';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { EventDetailsComponent } from 'src/app/dashboard/events/event-details/event-details.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  eventInformationMock,
  fullEventsMock,
  fullInvitesGroupsMock,
  newInviteMock,
  notificationsMock,
} from 'src/tests/mocks/mocks';

const newInviteMockCopy = deepCopy(newInviteMock);
const fullEventsMockCopy = deepCopy(fullEventsMock);
const eventInformationMockCopy = deepCopy(eventInformationMock);
const fullInvitesGroupsMockCopy = deepCopy(fullInvitesGroupsMock);
const notificationsMockCopy = deepCopy(notificationsMock);

describe('Event Details Component (Shallow Test)', () => {
  let fixture: ComponentFixture<EventDetailsComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let inviteGroupsServiceSpy: jasmine.SpyObj<InviteGroupsService>;

  beforeEach(waitForAsync(() => {
    const inviteGroupSpy = jasmine.createSpyObj('InviteGroupService', [
      'getAllInviteGroups',
    ]);
    const eventSpy = jasmine.createSpyObj('EventsService', [
      'getEventSettings',
      'getEventById',
    ]);
    const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', [
      'clearNotifications',
    ]);
    commonInvitesSpy.notifications$ = of(notificationsMockCopy);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [EventDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                eventResolved: {
                  isDeadlineMet: false,
                  invites: [{ ...newInviteMockCopy }],
                  id: newInviteMockCopy.eventId,
                },
              },
              paramMap: convertToParamMap({ id: newInviteMockCopy.id }),
            },
          },
        },
        { provide: InviteGroupsService, useValue: inviteGroupSpy },
        { provide: EventsService, useValue: eventSpy },
        { provide: CommonInvitesService, useValue: commonInvitesSpy },
        { provide: InvitesService, useValue: invitesSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;

    inviteGroupsServiceSpy = TestBed.inject(
      InviteGroupsService
    ) as jasmine.SpyObj<InviteGroupsService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsComponent);
    inviteGroupsServiceSpy.getAllInviteGroups.and.returnValue(
      of([fullInvitesGroupsMockCopy])
    );
    eventsServiceSpy.getEventById.and.returnValue(of(fullEventsMockCopy));
    eventsServiceSpy.getEventSettings.and.returnValue(
      of(eventInformationMockCopy)
    );

    fixture.detectChanges();
  });

  it('should have a card-section, a table-accordion section, 3 filters and 6 buttons', () => {
    const cardSection = fixture.nativeElement.querySelector('.card-section');
    const tableAccordion =
      fixture.nativeElement.querySelector('.table-accordion');
    const filterLabels = fixture.nativeElement.querySelectorAll('.form-label');
    const filterSelects =
      fixture.nativeElement.querySelectorAll('.form-select');
    const filterInput = fixture.nativeElement.querySelectorAll('.form-control');
    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(cardSection).withContext('Should have a card section').toBeTruthy();

    expect(tableAccordion)
      .withContext('Should have a table accordion section')
      .toBeTruthy();

    expect(filterLabels.length)
      .withContext('Should have 4 filter labels')
      .toBe(4);

    expect(filterLabels[0].textContent)
      .withContext('First filter label should be "View"')
      .toContain('Filtrar (Vista)');

    expect(filterLabels[1].textContent)
      .withContext('Second filter label should be "Need Accommodation"')
      .toContain('Filtrar (Necesita hospedaje)');

    expect(filterLabels[2].textContent)
      .withContext('Third filter label should be "Answered"')
      .toContain('Filtrar (Contestada)');

    expect(filterLabels[3].textContent)
      .withContext('Third filter label should be "Family"')
      .toContain('Filtrar (Familia)');

    expect(filterSelects.length)
      .withContext('Should have 3 filter selects')
      .toBe(3);

    expect(filterInput.length)
      .withContext('Should have 1 filter input')
      .toBe(1);

    expect(buttons.length).withContext('Should have 6 buttons').toBe(6);

    expect(buttons[0].textContent)
      .withContext('First button should be "Import Invites"')
      .toContain('Importar invitaciones');

    expect(buttons[0].disabled)
      .withContext('Second button should be enabled')
      .toBeFalse();

    expect(buttons[1].textContent)
      .withContext('Second button should be "New Invite"')
      .toContain('Nueva invitación');

    expect(buttons[1].disabled)
      .withContext('Second button should be enabled')
      .toBeFalse();
  });
});
