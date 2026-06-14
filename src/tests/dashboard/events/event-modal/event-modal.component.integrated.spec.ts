import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CommonModalResponse } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/common-modal.service';
import { DesignsService } from 'src/app/core/services/design.service';
import { EventTypesService } from 'src/app/core/services/event-types.service';
import { EventsService } from 'src/app/core/services/events.service';
import { UsersService } from 'src/app/core/services/users.service';
import { EventModalComponent } from 'src/app/dashboard/events/event-modal/event-modal.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy, toLocalDate } from 'src/app/shared/utils/tools';
import {
  designsMock,
  eventTypesMock,
  fullEventsMock,
  messageResponseMock,
  userDropdownDataMock,
} from 'src/tests/mocks/mocks';

let fullEventsMockCopy = deepCopy(fullEventsMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);
const userDropdownDataMockCopy = deepCopy(userDropdownDataMock);

describe('Event Modal Component (Integrated Test)', () => {
  fullEventsMockCopy = {
    ...fullEventsMockCopy,
    dateOfEvent: toLocalDate(fullEventsMockCopy.dateOfEvent).substring(0, 10),
    maxDateOfConfirmation: toLocalDate(
      fullEventsMockCopy.maxDateOfConfirmation,
    ).substring(0, 10),
  };

  let fixture: ComponentFixture<EventModalComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let commonModalServiceSpy: jasmine.SpyObj<CommonModalService>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let eventTypesServiceSpy: jasmine.SpyObj<EventTypesService>;
  let designsServiceSpy: jasmine.SpyObj<DesignsService>;

  const updateFormUsingEvent = (
    nameOfEvent: string,
    dateOfEvent: string,
    maxDateOfConfirmation: string,
    nameOfCelebrated: string,
    eventTypeId: string,
    designId: string,
    userId: string,
  ) => {
    const nameOfEventInput = fixture.debugElement.query(By.css('#nameOfEvent'));
    const dateOfEventInput = fixture.debugElement.query(By.css('#dateOfEvent'));
    const maxDateOfConfirmationInput = fixture.debugElement.query(
      By.css('#maxDateOfConfirmation'),
    );
    const nameOfCelebratedInput = fixture.debugElement.query(
      By.css('#nameOfCelebrated'),
    );
    const eventTypeIdInput = fixture.debugElement.query(By.css('#eventTypeId'));
    const designIdInput = fixture.debugElement.query(By.css('#designId'));
    const userIdInput = fixture.debugElement.query(By.css('#userId'));

    nameOfEventInput.nativeElement.value = nameOfEvent;
    nameOfEventInput.nativeElement.dispatchEvent(new Event('input'));

    dateOfEventInput.nativeElement.value = dateOfEvent;
    dateOfEventInput.nativeElement.dispatchEvent(new Event('input'));

    maxDateOfConfirmationInput.nativeElement.value = maxDateOfConfirmation;
    maxDateOfConfirmationInput.nativeElement.dispatchEvent(new Event('input'));

    nameOfCelebratedInput.nativeElement.value = nameOfCelebrated;
    nameOfCelebratedInput.nativeElement.dispatchEvent(new Event('input'));

    eventTypeIdInput.nativeElement.value = eventTypeId;
    eventTypeIdInput.nativeElement.dispatchEvent(new Event('change'));
    
    fixture.detectChanges();

    designIdInput.nativeElement.value = designId;
    designIdInput.nativeElement.dispatchEvent(new Event('change'));

    userIdInput.nativeElement.value = userId;
    userIdInput.nativeElement.dispatchEvent(new Event('change'));
  };

  beforeEach(async () => {
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'createEvent',
      'updateEvent',
    ]);
    const usersSpy = jasmine.createSpyObj('UsersService', [
      'getUsersDropdownData',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['open']);
    const eventTypesSpy = jasmine.createSpyObj('EventTypesService', [
      'getEventTypes',
    ]);
    const designsSpy = jasmine.createSpyObj('DesignsService', ['getDesigns']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ValidationPipe,
        ValidationErrorPipe,
        EventModalComponent,
      ],
      providers: [
        { provide: EventsService, useValue: eventsSpy },
        { provide: UsersService, useValue: usersSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: CommonModalService, useValue: commonModalSpy },
        { provide: EventTypesService, useValue: eventTypesSpy },
        { provide: DesignsService, useValue: designsSpy },
      ],
    }).compileComponents();

    eventsServiceSpy = TestBed.inject(
      EventsService,
    ) as jasmine.SpyObj<EventsService>;
    commonModalServiceSpy = TestBed.inject(
      CommonModalService,
    ) as jasmine.SpyObj<CommonModalService>;
    usersServiceSpy = TestBed.inject(
      UsersService,
    ) as jasmine.SpyObj<UsersService>;
    eventTypesServiceSpy = TestBed.inject(
      EventTypesService,
    ) as jasmine.SpyObj<EventTypesService>;
    designsServiceSpy = TestBed.inject(
      DesignsService,
    ) as jasmine.SpyObj<DesignsService>;

    usersServiceSpy.getUsersDropdownData.and.returnValue(
      of([userDropdownDataMockCopy]),
    );

    eventTypesServiceSpy.getEventTypes.and.returnValue(of(eventTypesMock));
    designsServiceSpy.getDesigns.and.returnValue(of(designsMock));

    fixture = TestBed.createComponent(EventModalComponent);

    fixture.componentRef.setInput('showModalValue', true);
    fixture.detectChanges();
  });

  it('saving new event should call createEvent', () => {
    eventsServiceSpy.createEvent.and.returnValue(of(messageResponseMockCopy));
    spyOn(fixture.componentInstance.updateEvents, 'emit');

    updateFormUsingEvent(
      fullEventsMockCopy.nameOfEvent,
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.maxDateOfConfirmation,
      fullEventsMockCopy.nameOfCelebrated,
      eventTypesMock[1].id,
      designsMock[1].id,
      fullEventsMockCopy.userId,
    );

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    expect(eventsServiceSpy.createEvent)
      .withContext(
        "CreateEvent method from EventsService should've been called",
      )
      .toHaveBeenCalled();

    expect(fixture.componentInstance.updateEvents.emit)
      .withContext('Should emit updateEvents event')
      .toHaveBeenCalled();
  });

  it('updating event should call updateEvent', () => {
    eventsServiceSpy.updateEvent.and.returnValue(of(messageResponseMockCopy));
    spyOn(fixture.componentInstance.updateEvents, 'emit');
    fixture.componentInstance.originalEventTypeId = eventTypesMock[1].id;
    fixture.componentInstance.createEventForm.patchValue({
      id: fullEventsMockCopy.id,
    });

    updateFormUsingEvent(
      fullEventsMockCopy.nameOfEvent,
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.maxDateOfConfirmation,
      fullEventsMockCopy.nameOfCelebrated,
      eventTypesMock[1].id,
      designsMock[1].id,
      fullEventsMockCopy.userId,
    );

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    expect(eventsServiceSpy.updateEvent)
      .withContext(
        "UpdateEvent method from EventsService should've been called",
      )
      .toHaveBeenCalled();

    expect(fixture.componentInstance.updateEvents.emit)
      .withContext('Should emit updateEvents event')
      .toHaveBeenCalled();
  });

  it('updating type of event with one incompatible should call open modal', () => {
    commonModalServiceSpy.open.and.returnValue(of(CommonModalResponse.Confirm));
    eventsServiceSpy.updateEvent.and.returnValue(of(messageResponseMockCopy));
    spyOn(fixture.componentInstance.updateEvents, 'emit');
    fixture.componentInstance.originalEventTypeId = eventTypesMock[1].id;
    fixture.componentInstance.createEventForm.patchValue({
      id: fullEventsMockCopy.id,
    });

    updateFormUsingEvent(
      fullEventsMockCopy.nameOfEvent,
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.maxDateOfConfirmation,
      fullEventsMockCopy.nameOfCelebrated,
      eventTypesMock[2].id,
      designsMock[2].id,
      fullEventsMockCopy.userId,
    );

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    expect(commonModalServiceSpy.open)
      .withContext(
        'Open method from CommonModalService should have been called',
      )
      .toHaveBeenCalled();

    expect(eventsServiceSpy.updateEvent)
      .withContext(
        "UpdateEvent method from EventsService should've been called",
      )
      .toHaveBeenCalled();

    expect(fixture.componentInstance.updateEvents.emit)
      .withContext('Should emit updateEvents event')
      .toHaveBeenCalled();
  });

  it("updating type of event with one incompatible should call open modal but if we cancel it shouldn't call update", () => {
    commonModalServiceSpy.open.and.returnValue(of(CommonModalResponse.Cancel));
    fixture.componentInstance.originalEventTypeId = eventTypesMock[1].id;
    fixture.componentInstance.createEventForm.patchValue({
      id: fullEventsMockCopy.id,
    });

    updateFormUsingEvent(
      fullEventsMockCopy.nameOfEvent,
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.maxDateOfConfirmation,
      fullEventsMockCopy.nameOfCelebrated,
      eventTypesMock[2].id,
      designsMock[2].id,
      fullEventsMockCopy.userId,
    );

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    expect(commonModalServiceSpy.open)
      .withContext(
        'Open method from CommonModalService should have been called',
      )
      .toHaveBeenCalled();

    expect(eventsServiceSpy.updateEvent)
      .withContext(
        "UpdateEvent method from EventsService shouldn't have been called",
      )
      .not.toHaveBeenCalled();
  });
});
