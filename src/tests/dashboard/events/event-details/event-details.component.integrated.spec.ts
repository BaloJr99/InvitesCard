import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { INotification } from 'src/app/core/models/common';
import { EventType } from 'src/app/core/models/enum';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { EventsService } from 'src/app/core/services/events.service';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { EventCardComponent } from 'src/app/dashboard/events/event-details/event-card/event-card.component';
import { EventDetailsComponent } from 'src/app/dashboard/events/event-details/event-details.component';
import { InviteModalComponent } from 'src/app/dashboard/events/event-details/invite-modal/invite-modal.component';
import { InvitesImportModalComponent } from 'src/app/dashboard/events/event-details/invites-import-modal/invites-import-modal.component';
import { TableComponent } from 'src/app/dashboard/events/event-details/table/table.component';
import {
  confirmedInviteMock,
  eventInformationMock,
  fullInvitesGroupsMock,
  newInviteMock,
  notConfirmedInviteMock,
} from 'src/tests/mocks/mocks';

describe('Event Details Component (Integrated Test)', () => {
  let fixture: ComponentFixture<EventDetailsComponent>;
  let inviteGroupsServiceSpy: jasmine.SpyObj<InviteGroupsService>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let commonInvitesServiceSpy: jasmine.SpyObj<CommonInvitesService>;
  let notificationsDataSubject: Subject<INotification[]>;

  beforeEach(waitForAsync(() => {
    notificationsDataSubject = new Subject<INotification[]>();
    const inviteGroupsSpy = jasmine.createSpyObj('InviteGroupsService', [
      'getAllInviteGroups',
    ]);
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getEventInformation',
    ]);
    const commonInvitesSpy = jasmine.createSpyObj(
      'CommonInvitesService',
      ['clearNotifications', 'updateNotifications'],

      {
        notifications$: notificationsDataSubject.asObservable(),
      }
    );
    const invitesServiceSpy = jasmine.createSpyObj('InvitesService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);

    TestBed.configureTestingModule({
      declarations: [
        TableComponent,
        EventCardComponent,
        EventDetailsComponent,
        InvitesImportModalComponent,
        InviteModalComponent,
      ],
      imports: [ReactiveFormsModule, DataTablesModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                eventResolved: {
                  isDeadlineMet: false,
                  invites: [
                    { ...newInviteMock },
                    { ...confirmedInviteMock },
                    { ...notConfirmedInviteMock },
                  ],
                  id: newInviteMock.eventId,
                },
              },
              paramMap: convertToParamMap({ id: newInviteMock.id }),
            },
          },
        },
        { provide: InviteGroupsService, useValue: inviteGroupsSpy },
        { provide: EventsService, useValue: eventsSpy },
        { provide: CommonInvitesService, useValue: commonInvitesSpy },
        { provide: InvitesService, useValue: invitesServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
      ],
    }).compileComponents();

    inviteGroupsServiceSpy = TestBed.inject(
      InviteGroupsService
    ) as jasmine.SpyObj<InviteGroupsService>;

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;

    commonInvitesServiceSpy = TestBed.inject(
      CommonInvitesService
    ) as jasmine.SpyObj<CommonInvitesService>;
  }));

  beforeEach(() => {
    inviteGroupsServiceSpy.getAllInviteGroups.and.returnValue(
      of([{ ...fullInvitesGroupsMock }])
    );
    eventsServiceSpy.getEventInformation.and.returnValue(
      of({ ...eventInformationMock, typeOfEvent: EventType.Xv })
    );

    fixture = TestBed.createComponent(EventDetailsComponent);
    fixture.detectChanges();
  });

  it('ngOnInit should call updateNotifications, clearNotifications', () => {
    expect(commonInvitesServiceSpy.updateNotifications)
      .withContext('Expected to call updateNotifications')
      .toHaveBeenCalled();

    expect(commonInvitesServiceSpy.clearNotifications)
      .withContext('Expected to call clearNotifications')
      .toHaveBeenCalled();
  });

  it('should have 4 event cards', () => {
    const eventCards = fixture.nativeElement.querySelectorAll('app-event-card');
    expect(eventCards.length)
      .withContext('Expected to have 4 event cards')
      .toBe(4);
  });

  it('should have 1 table with 3 invites', () => {
    const table = fixture.debugElement.queryAll(By.css('app-table'));
    expect(table)
      .withContext('Expected to have a table in the component')
      .not.toBeNull();

    expect(table.length)
      .withContext('Expected to have 1 table in the component')
      .toBe(1);

    const rows = table[0].queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 3 rows in the table')
      .toBe(3);
  });

  it('should filter by family name', () => {
    const filterInput = fixture.debugElement.query(By.css('#filterByFamily'));
    filterInput.nativeElement.value = 'Test Family';
    filterInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    let rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 3 rows in the table')
      .toBe(3);

    filterInput.nativeElement.value = 'Familia';
    filterInput.nativeElement.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();

    rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 0 rows in the table')
      .toBe(0);
  });

  it('should filter by needsAccomodation', () => {
    const filterInput = fixture.debugElement.query(
      By.css('#filterByNeedsAccomodation')
    );
    filterInput.nativeElement.value = 'true';
    filterInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    let rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 2 rows in the table')
      .toBe(2);

    filterInput.nativeElement.value = 'false';
    filterInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 0 rows in the table')
      .toBe(0);
  });

  it('should filter by inviteViewed', () => {
    const filterInput = fixture.debugElement.query(
      By.css('#filterByInviteViewed')
    );
    filterInput.nativeElement.value = 'true';
    filterInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    let rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 2 rows in the table')
      .toBe(2);

    filterInput.nativeElement.value = 'false';
    filterInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 1 rows in the table')
      .toBe(1);
  });
});
