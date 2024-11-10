import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CommonModalResponse, EventType } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { EventsService } from 'src/app/core/services/events.service';
import { UsersService } from 'src/app/core/services/users.service';
import { EventModalComponent } from 'src/app/dashboard/events/event-modal/event-modal.component';
import {
  fullEventsMock,
  messageResponseMock,
  userDropdownDataMock,
} from 'src/tests/mocks/mocks';

describe('Event Modal Component (Integrated Test)', () => {
  let fixture: ComponentFixture<EventModalComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let commonModalServiceSpy: jasmine.SpyObj<CommonModalService>;

  const updateFormUsingEvent = (
    nameOfEvent: string,
    dateOfEvent: string,
    maxDateOfConfirmation: string,
    nameOfCelebrated: string,
    typeOfEvent: EventType,
    userId: string
  ) => {
    const nameOfEventInput = fixture.debugElement.query(By.css('#nameOfEvent'));
    const dateOfEventInput = fixture.debugElement.query(By.css('#dateOfEvent'));
    const maxDateOfConfirmationInput = fixture.debugElement.query(
      By.css('#maxDateOfConfirmation')
    );
    const nameOfCelebratedInput = fixture.debugElement.query(
      By.css('#nameOfCelebrated')
    );
    const typeOfEventInput = fixture.debugElement.query(By.css('#typeOfEvent'));
    const userIdInput = fixture.debugElement.query(By.css('#userId'));

    nameOfEventInput.nativeElement.value = nameOfEvent;
    nameOfEventInput.nativeElement.dispatchEvent(new Event('input'));

    dateOfEventInput.nativeElement.value = dateOfEvent;
    dateOfEventInput.nativeElement.dispatchEvent(new Event('input'));

    maxDateOfConfirmationInput.nativeElement.value = maxDateOfConfirmation;
    maxDateOfConfirmationInput.nativeElement.dispatchEvent(new Event('input'));

    nameOfCelebratedInput.nativeElement.value = nameOfCelebrated;
    nameOfCelebratedInput.nativeElement.dispatchEvent(new Event('input'));

    typeOfEventInput.nativeElement.value = typeOfEvent;
    typeOfEventInput.nativeElement.dispatchEvent(new Event('change'));

    userIdInput.nativeElement.value = userId;
    userIdInput.nativeElement.dispatchEvent(new Event('change'));
  };

  beforeEach(waitForAsync(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'createEvent',
      'updateEvent',
    ]);
    const usersSpy = jasmine.createSpyObj('UsersService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['open']);

    TestBed.configureTestingModule({
      declarations: [EventModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: EventsService, useValue: eventsSpy },
        { provide: UsersService, useValue: usersSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: CommonModalService, useValue: commonModalSpy },
      ],
    }).compileComponents();

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;
    commonModalServiceSpy = TestBed.inject(
      CommonModalService
    ) as jasmine.SpyObj<CommonModalService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventModalComponent);
    fixture.componentInstance.users = [{ ...userDropdownDataMock }];
    fixture.detectChanges();
  });

  it('saving new event should call createEvent', () => {
    eventsServiceSpy.createEvent.and.returnValue(of(messageResponseMock));
    spyOn(fixture.componentInstance.updateEvents, 'emit');

    updateFormUsingEvent(
      fullEventsMock.nameOfEvent,
      fullEventsMock.dateOfEvent,
      fullEventsMock.maxDateOfConfirmation,
      fullEventsMock.nameOfCelebrated,
      EventType.Xv,
      fullEventsMock.userId
    );
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    expect(eventsServiceSpy.createEvent)
      .withContext(
        "CreateEvent method from EventsService should've been called"
      )
      .toHaveBeenCalled();

    expect(fixture.componentInstance.updateEvents.emit)
      .withContext('Should emit updateEvents event')
      .toHaveBeenCalled();
  });

  it('updating event should call updateEvent', () => {
    eventsServiceSpy.updateEvent.and.returnValue(of(messageResponseMock));
    spyOn(fixture.componentInstance.updateEvents, 'emit');
    fixture.componentInstance.originalEventType = EventType.Xv;
    fixture.componentInstance.createEventForm.patchValue({
      id: fullEventsMock.id,
    });

    updateFormUsingEvent(
      fullEventsMock.nameOfEvent,
      fullEventsMock.dateOfEvent,
      fullEventsMock.maxDateOfConfirmation,
      fullEventsMock.nameOfCelebrated,
      EventType.Xv,
      fullEventsMock.userId
    );

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    expect(eventsServiceSpy.updateEvent)
      .withContext(
        "UpdateEvent method from EventsService should've been called"
      )
      .toHaveBeenCalled();

    expect(fixture.componentInstance.updateEvents.emit)
      .withContext('Should emit updateEvents event')
      .toHaveBeenCalled();
  });

  it('updating type of event with one incompatible should call open modal', () => {
    commonModalServiceSpy.open.and.returnValue(of(CommonModalResponse.Confirm));
    eventsServiceSpy.updateEvent.and.returnValue(of(messageResponseMock));
    spyOn(fixture.componentInstance.updateEvents, 'emit');
    fixture.componentInstance.originalEventType = EventType.Xv;
    fixture.componentInstance.createEventForm.patchValue({
      id: fullEventsMock.id,
    });

    updateFormUsingEvent(
      fullEventsMock.nameOfEvent,
      fullEventsMock.dateOfEvent,
      fullEventsMock.maxDateOfConfirmation,
      fullEventsMock.nameOfCelebrated,
      EventType.SaveTheDate,
      fullEventsMock.userId
    );

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    expect(commonModalServiceSpy.open)
      .withContext(
        'Open method from CommonModalService should have been called'
      )
      .toHaveBeenCalled();

    expect(eventsServiceSpy.updateEvent)
      .withContext(
        "UpdateEvent method from EventsService should've been called"
      )
      .toHaveBeenCalled();

    expect(fixture.componentInstance.updateEvents.emit)
      .withContext('Should emit updateEvents event')
      .toHaveBeenCalled();
  });

  it("updating type of event with one incompatible should call open modal but if we cancel it shouldn't call update", () => {
    commonModalServiceSpy.open.and.returnValue(of(CommonModalResponse.Cancel));
    fixture.componentInstance.originalEventType = EventType.Xv;
    fixture.componentInstance.createEventForm.patchValue({
      id: fullEventsMock.id,
    });

    updateFormUsingEvent(
      fullEventsMock.nameOfEvent,
      fullEventsMock.dateOfEvent,
      fullEventsMock.maxDateOfConfirmation,
      fullEventsMock.nameOfCelebrated,
      EventType.SaveTheDate,
      fullEventsMock.userId
    );

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    expect(commonModalServiceSpy.open)
      .withContext(
        'Open method from CommonModalService should have been called'
      )
      .toHaveBeenCalled();

    expect(eventsServiceSpy.updateEvent)
      .withContext(
        "UpdateEvent method from EventsService shouldn't have been called"
      )
      .not.toHaveBeenCalled();
  });
});
