import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
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
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  confirmedInviteMock,
  eventInformationMock,
  fullEventsMock,
  fullInvitesGroupsMock,
  newInviteMock,
  notConfirmedInviteMock,
  notificationsMock,
} from 'src/tests/mocks/mocks';

const confirmedInviteMockCopy = deepCopy(confirmedInviteMock);
const eventInformationMockCopy = deepCopy(eventInformationMock);
const fullEventsMockCopy = deepCopy(fullEventsMock);
const fullInvitesGroupsMockCopy = deepCopy(fullInvitesGroupsMock);
const newInviteMockCopy = deepCopy(newInviteMock);
const notConfirmedInviteMockCopy = deepCopy(notConfirmedInviteMock);
const notificationsMockCopy = deepCopy(notificationsMock);

describe('Event Details Component (Integrated Test)', () => {
  let fixture: ComponentFixture<EventDetailsComponent>;
  let inviteGroupsServiceSpy: jasmine.SpyObj<InviteGroupsService>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;

  const markCheckbox = (rowIndex: number) => {
    const table = fixture.debugElement.query(By.css('table'));
    const checkboxes = table.queryAll(By.css('tbody input[type="checkbox"]'));
    const checkbox = checkboxes[rowIndex];

    checkbox.nativeElement.click();
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const inviteGroupsSpy = jasmine.createSpyObj('InviteGroupsService', [
      'getAllInviteGroups',
    ]);
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getEventSettings',
      'getEventById',
    ]);
    const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', [
      'clearNotifications',
      'updateNotifications',
    ]);
    commonInvitesSpy.notifications$ = of(notificationsMockCopy);
    const invitesServiceSpy = jasmine.createSpyObj('InvitesService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ValidationPipe,
        ValidationErrorPipe,
        TableComponent,
        EventCardComponent,
        EventDetailsComponent,
        InvitesImportModalComponent,
        InviteModalComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                eventResolved: {
                  isDeadlineMet: false,
                  invites: [
                    { ...newInviteMockCopy },
                    { ...confirmedInviteMockCopy },
                    { ...notConfirmedInviteMockCopy },
                  ],
                  id: newInviteMockCopy.eventId,
                },
              },
              paramMap: convertToParamMap({ id: newInviteMockCopy.id }),
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
  }));

  beforeEach(() => {
    inviteGroupsServiceSpy.getAllInviteGroups.and.returnValue(
      of([fullInvitesGroupsMockCopy])
    );
    eventsServiceSpy.getEventById.and.returnValue(of(fullEventsMockCopy));
    eventsServiceSpy.getEventSettings.and.returnValue(
      of({
        ...eventInformationMockCopy,
        typeOfEvent: EventType.Xv,
      })
    );

    fixture = TestBed.createComponent(EventDetailsComponent);
    fixture.detectChanges();
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
    const searchButton = fixture.debugElement.query(By.css('#searchInvites'));
    searchButton.nativeElement.click();
    fixture.detectChanges();

    let rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 3 rows in the table')
      .toBe(3);

    filterInput.nativeElement.value = 'Familia';
    searchButton.nativeElement.click();
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
    const searchButton = fixture.debugElement.query(By.css('#searchInvites'));
    searchButton.nativeElement.click();
    fixture.detectChanges();

    let rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 2 rows in the table')
      .toBe(2);

    filterInput.nativeElement.value = 'false';
    searchButton.nativeElement.click();
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
    const searchButton = fixture.debugElement.query(By.css('#searchInvites'));
    searchButton.nativeElement.click();
    fixture.detectChanges();

    let rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 2 rows in the table')
      .toBe(2);

    filterInput.nativeElement.value = 'false';
    searchButton.nativeElement.click();
    fixture.detectChanges();

    rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length)
      .withContext('Expected to have 1 row in the table')
      .toBe(1);
  });

  it('first button should call editInvite', () => {
    spyOn(fixture.componentInstance, 'openInviteModal');

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.query(By.css('tbody')).queryAll(By.css('tr'));
    const buttons = rows[0].queryAll(By.css('button'));

    buttons[0].nativeElement.click();

    expect(fixture.componentInstance.openInviteModal)
      .withContext('Expected to call openInviteModal')
      .toHaveBeenCalled();
  });

  it('second button should call showModal', () => {
    spyOn(fixture.componentInstance, 'showModal');

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.query(By.css('tbody')).queryAll(By.css('tr'));
    const buttons = rows[0].queryAll(By.css('button'));

    buttons[1].nativeElement.click();

    expect(fixture.componentInstance.showModal)
      .withContext('Expected to call showModal')
      .toHaveBeenCalled();
  });

  it('third button should call copyToClipBoard', () => {
    spyOn(fixture.componentInstance, 'copyToClipBoard');

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.query(By.css('tbody')).queryAll(By.css('tr'));
    const buttons = rows[0].queryAll(By.css('button'));

    buttons[2].nativeElement.click();

    expect(fixture.componentInstance.copyToClipBoard)
      .withContext('Expected to call copyToClipBoard')
      .toHaveBeenCalled();
  });

  it(`bulk delete button should be disabled and shouln't call bulkDeleteInvites`, () => {
    spyOn(fixture.componentInstance, 'bulkDeleteInvites');

    const accordion = fixture.debugElement.query(By.css('.accordion'));
    const bulkDelete = accordion.query(By.css('.accordion-body > button'));

    expect(bulkDelete.nativeElement.disabled)
      .withContext('Expected to be disabled')
      .toBeTrue();

    expect(fixture.componentInstance.bulkDeleteInvites)
      .withContext('deleteInvites should not be called')
      .not.toHaveBeenCalled();
  });

  it(`bulk delete button shouldn't be disabled and should call bulkDeleteInvites`, () => {
    spyOn(fixture.componentInstance, 'bulkDeleteInvites');

    markCheckbox(0);

    const accordion = fixture.debugElement.query(By.css('.accordion'));
    const bulkDelete = accordion.query(By.css('.accordion-body > button'));

    bulkDelete.nativeElement.click();

    expect(bulkDelete.nativeElement.disabled)
      .withContext('Expected to not be disabled')
      .toBeFalse();

    expect(fixture.componentInstance.bulkDeleteInvites)
      .withContext('deleteInvites should be called')
      .toHaveBeenCalled();
  });

  it('markCheckbox should set the record beingDeleted to true ', () => {
    markCheckbox(0);

    expect(
      fixture.componentInstance.selectedIds[
        fullInvitesGroupsMockCopy.inviteGroup
      ]
    )
      .withContext('Record should be marked for deletion')
      .toContain(newInviteMockCopy.id);
  });
});
