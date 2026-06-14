import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { DesignType, EventType } from 'src/app/core/models/enum';
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
  userDropdownDataMock,
} from 'src/tests/mocks/mocks';

let fullEventsMockCopy = deepCopy(fullEventsMock);
const userDropdownDataMockCopy = deepCopy(userDropdownDataMock);

describe('Event Modal Component (Shallow Test)', () => {
  let fixture: ComponentFixture<EventModalComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let eventTypesServiceSpy: jasmine.SpyObj<EventTypesService>;
  let designsServiceSpy: jasmine.SpyObj<DesignsService>;

  fullEventsMockCopy = {
    ...fullEventsMockCopy,
    dateOfEvent: toLocalDate(fullEventsMockCopy.dateOfEvent).substring(0, 10),
    maxDateOfConfirmation: toLocalDate(
      fullEventsMockCopy.maxDateOfConfirmation,
    ).substring(0, 10),
  };

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
    const eventsSpy = jasmine.createSpyObj('EventsService', ['']);
    const usersSpy = jasmine.createSpyObj('UsersService', [
      'getUsersDropdownData',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
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
        { provide: EventTypesService, useValue: eventTypesSpy },
        { provide: DesignsService, useValue: designsSpy },
      ],
    }).compileComponents();

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

  it('created a form with nameOfEvent, dateOfEvent, maxDateOfConfirmation, nameOfCelebrated, typeOfEvent, userId, 2 buttons (save, close), register', () => {
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

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const closeButton = buttons[1];
    const saveButton = buttons[2];

    expect(nameOfEventInput)
      .withContext("name of event input shouldn't be null")
      .not.toBeNull();

    expect(dateOfEventInput)
      .withContext("date of event input shouldn't be null")
      .not.toBeNull();

    expect(maxDateOfConfirmationInput)
      .withContext("max date of confirmation input shouldn't be null")
      .not.toBeNull();

    expect(nameOfCelebratedInput)
      .withContext("name of celebrated input shouldn't be null")
      .not.toBeNull();

    expect(eventTypeIdInput)
      .withContext("eventTypeId input shouldn't be null")
      .not.toBeNull();

    expect(designIdInput)
      .withContext("designId input shouldn't be null")
      .not.toBeNull();

    expect(userIdInput)
      .withContext("user id input shouldn't be null")
      .not.toBeNull();

    expect(closeButton)
      .withContext("close button shouldn't be null")
      .not.toBeNull();

    expect(saveButton)
      .withContext("save button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(
      fullEventsMockCopy.nameOfEvent,
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.maxDateOfConfirmation,
      fullEventsMockCopy.nameOfCelebrated,
      fullEventsMockCopy.eventTypeId,
      fullEventsMockCopy.designId,
      fullEventsMockCopy.userId,
    );

    expect(
      fixture.componentInstance.createEventForm.controls['nameOfEvent'].value,
    )
      .withContext('NameOfEvent control should be filled when input changes')
      .toBe(fullEventsMockCopy.nameOfEvent);

    expect(
      fixture.componentInstance.createEventForm.controls['dateOfEvent'].value,
    )
      .withContext('DateOfEvent control should be filled when input changes')
      .toBe(fullEventsMockCopy.dateOfEvent);

    expect(
      fixture.componentInstance.createEventForm.controls[
        'maxDateOfConfirmation'
      ].value,
    )
      .withContext(
        'MaxDateOfConfirmation control should be filled when input changes',
      )
      .toBe(fullEventsMockCopy.maxDateOfConfirmation);

    expect(
      fixture.componentInstance.createEventForm.controls['nameOfCelebrated']
        .value,
    )
      .withContext(
        'NameOfCelebrated control should be filled when input changes',
      )
      .toBe(fullEventsMockCopy.nameOfCelebrated);

    expect(
      fixture.componentInstance.createEventForm.controls['eventTypeId'].value,
    )
      .withContext('EventTypeId control should be filled when input changes')
      .toBe(fullEventsMockCopy.eventTypeId);

    expect(fixture.componentInstance.createEventForm.controls['designId'].value)
      .withContext('designId control should be filled when input changes')
      .toBe(fullEventsMockCopy.designId);

    expect(fixture.componentInstance.createEventForm.controls['userId'].value)
      .withContext('UserId control should be filled when input changes')
      .toBe(fullEventsMockCopy.userId);
  });

  it('Expect save button to trigger saveEvent', () => {
    spyOn(fixture.componentInstance, 'saveEvent');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];

    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.saveEvent)
      .withContext('SaveEvent method should have been called')
      .toHaveBeenCalled();
  });

  it('Display error messages when fields are blank', () => {
    updateFormUsingEvent('', '', '', '', EventType.None, DesignType.None, '');
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback'),
    );

    const nameOfEventErrorSpan = errorSpans[0];
    const dateOfEventErrorSpan = errorSpans[1];
    const maxDateOfConfirmationErrorSpan = errorSpans[2];
    const eventTypesIdErrorSpan = errorSpans[3];
    const designIdErrorSpan = errorSpans[4];
    const nameOfCelebratedErrorSpan = errorSpans[5];
    const userIdErrorSpan = errorSpans[6];

    expect(nameOfEventErrorSpan.nativeElement.innerHTML)
      .withContext('NameOfEvent span for error should be filled')
      .toContain('El nombre del evento es requerido');

    expect(dateOfEventErrorSpan.nativeElement.innerHTML)
      .withContext('DateOfEvent span for error should be filled')
      .toContain('La fecha del evento es requerida');

    expect(maxDateOfConfirmationErrorSpan.nativeElement.innerHTML)
      .withContext('MaxDateOfConfirmation span for error should be filled')
      .toContain('La fecha de limite de confirmación es requerida');

    expect(eventTypesIdErrorSpan.nativeElement.innerHTML)
      .withContext('EventTypeId span for error should be filled')
      .toContain('El tipo de evento es requerido');

    expect(designIdErrorSpan.nativeElement.innerHTML)
      .withContext('DesignId span for error should be filled')
      .toContain('El diseño es requerido');

    expect(nameOfCelebratedErrorSpan.nativeElement.innerHTML)
      .withContext('NameOfCelebrated span for error should be filled')
      .toContain('El nombre del festejado es requerido');

    expect(userIdErrorSpan.nativeElement.innerHTML)
      .withContext('UserId span for error should be filled')
      .toContain('El usuario es requerido');
  });

  it("Shouldn't display error message when fields are filled", () => {
    updateFormUsingEvent(
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.dateOfEvent,
      eventTypesMock[1].id,
      designsMock[1].id,
      fullEventsMockCopy.userId,
    );

    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback'),
    );

    expect(errorSpans.length)
      .withContext('Should not display any error messages')
      .toBe(0);
  });
});
