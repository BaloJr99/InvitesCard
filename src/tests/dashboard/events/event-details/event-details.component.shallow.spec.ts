import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { INotification } from 'src/app/core/models/common';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { EventsService } from 'src/app/core/services/events.service';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { EventDetailsComponent } from 'src/app/dashboard/events/event-details/event-details.component';
import { newInviteMock } from 'src/tests/mocks/mocks';

describe('Event Details Component (Shallow Test)', () => {
  let fixture: ComponentFixture<EventDetailsComponent>;
  let notificationsDataSubject: Subject<INotification[]>;

  beforeEach(waitForAsync(() => {
    notificationsDataSubject = new Subject<INotification[]>();

    const inviteGroupSpy = jasmine.createSpyObj('InviteGroupService', [
      'getAllInviteGroups',
    ]);
    const eventSpy = jasmine.createSpyObj('EventsService', [
      'getEventInformation',
    ]);
    const commonInvitesSpy = jasmine.createSpyObj(
      'CommonInvitesService',
      ['clearNotifications'],
      {
        notifications$: notificationsDataSubject.asObservable(),
      }
    );

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
                  invites: [{ ...newInviteMock }],
                  id: newInviteMock.eventId,
                },
              },
              paramMap: convertToParamMap({ id: newInviteMock.id }),
            },
          },
        },
        { provide: InviteGroupsService, useValue: inviteGroupSpy },
        { provide: EventsService, useValue: eventSpy },
        { provide: CommonInvitesService, useValue: commonInvitesSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsComponent);
    fixture.componentInstance.originalInvites = [{ ...newInviteMock }];
    fixture.detectChanges();
  });

  it('should have a card-section, a table-accordion section, 3 filters and 2 buttons', () => {
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
      .withContext('Should have 3 filter labels')
      .toBe(3);

    expect(filterLabels[0].textContent)
      .withContext('First filter label should be "View"')
      .toContain('Filtrar (Vista)');

    expect(filterLabels[1].textContent)
      .withContext('Second filter label should be "Need Accommodation"')
      .toContain('Filtrar (Necesita hospedaje)');

    expect(filterLabels[2].textContent)
      .withContext('Third filter label should be "Family"')
      .toContain('Filtrar (Familia)');

    expect(filterSelects.length)
      .withContext('Should have 2 filter selects')
      .toBe(2);

    expect(filterInput.length)
      .withContext('Should have 1 filter input')
      .toBe(1);

    expect(buttons.length).withContext('Should have 2 buttons').toBe(2);

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

  it('should have import invites and new invite buttons disabled if deadline is met', () => {
    fixture.componentInstance.isDeadlineMet = true;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons[0].disabled)
      .withContext('Import invites button should be disabled')
      .toBeTrue();

    expect(buttons[1].disabled)
      .withContext('New invite button should be disabled')
      .toBeTrue();
  });
});
