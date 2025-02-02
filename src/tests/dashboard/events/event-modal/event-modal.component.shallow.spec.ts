import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { EventType } from 'src/app/core/models/enum';
import { EventsService } from 'src/app/core/services/events.service';
import { UsersService } from 'src/app/core/services/users.service';
import { EventModalComponent } from 'src/app/dashboard/events/event-modal/event-modal.component';
import { deepCopy, toLocalDate } from 'src/app/shared/utils/tools';
import { fullEventsMock, userDropdownDataMock } from 'src/tests/mocks/mocks';

let fullEventsMockCopy = deepCopy(fullEventsMock);
const userDropdownDataMockCopy = deepCopy(userDropdownDataMock);

describe('Event Modal Component (Shallow Test)', () => {
  let fixture: ComponentFixture<EventModalComponent>;

  fullEventsMockCopy = {
    ...fullEventsMockCopy,
    dateOfEvent: toLocalDate(fullEventsMockCopy.dateOfEvent).substring(0, 10),
    maxDateOfConfirmation: toLocalDate(
      fullEventsMockCopy.maxDateOfConfirmation
    ).substring(0, 10),
  };

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
    const eventsSpy = jasmine.createSpyObj('EventsService', ['']);
    const usersSpy = jasmine.createSpyObj('UsersService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [EventModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: EventsService, useValue: eventsSpy },
        { provide: UsersService, useValue: usersSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventModalComponent);
    fixture.componentInstance.users = [{ ...userDropdownDataMockCopy }];
    fixture.detectChanges();
  });

  it('created a form with nameOfEvent, dateOfEvent, maxDateOfConfirmation, nameOfCelebrated, typeOfEvent, userId, 2 buttons (save, close), register', () => {
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

    expect(typeOfEventInput)
      .withContext("type of event input shouldn't be null")
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
      fullEventsMockCopy.typeOfEvent,
      fullEventsMockCopy.userId
    );
    expect(
      fixture.componentInstance.createEventForm.controls['nameOfEvent'].value
    )
      .withContext('NameOfEvent control should be filled when input changes')
      .toBe(fullEventsMockCopy.nameOfEvent);

    expect(
      fixture.componentInstance.createEventForm.controls['dateOfEvent'].value
    )
      .withContext('DateOfEvent control should be filled when input changes')
      .toBe(fullEventsMockCopy.dateOfEvent);

    expect(
      fixture.componentInstance.createEventForm.controls[
        'maxDateOfConfirmation'
      ].value
    )
      .withContext(
        'MaxDateOfConfirmation control should be filled when input changes'
      )
      .toBe(fullEventsMockCopy.maxDateOfConfirmation);

    expect(
      fixture.componentInstance.createEventForm.controls['nameOfCelebrated']
        .value
    )
      .withContext(
        'NameOfCelebrated control should be filled when input changes'
      )
      .toBe(fullEventsMockCopy.nameOfCelebrated);

    expect(
      fixture.componentInstance.createEventForm.controls['typeOfEvent'].value
    )
      .withContext('TypeOfEvent control should be filled when input changes')
      .toBe(fullEventsMockCopy.typeOfEvent);

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
    updateFormUsingEvent('', '', '', '', EventType.None, '');
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const nameOfEventErrorSpan = errorSpans[0];
    const dateOfEventErrorSpan = errorSpans[1];
    const maxDateOfConfirmationErrorSpan = errorSpans[2];
    const typeOfEventErrorSpan = errorSpans[3];
    const nameOfCelebratedErrorSpan = errorSpans[4];
    const userIdErrorSpan = errorSpans[5];

    expect(nameOfEventErrorSpan.nativeElement.innerHTML)
      .withContext('NameOfEvent span for error should be filled')
      .toContain('Ingresar nombre del evento');

    expect(dateOfEventErrorSpan.nativeElement.innerHTML)
      .withContext('DateOfEvent span for error should be filled')
      .toContain('Ingresar fecha del evento');

    expect(maxDateOfConfirmationErrorSpan.nativeElement.innerHTML)
      .withContext('MaxDateOfConfirmation span for error should be filled')
      .toContain('Ingresar fecha límite de confirmación');

    expect(typeOfEventErrorSpan.nativeElement.innerHTML)
      .withContext('TypeOfEvent span for error should be filled')
      .toContain('Seleccionar tipo de evento');

    expect(nameOfCelebratedErrorSpan.nativeElement.innerHTML)
      .withContext('NameOfCelebrated span for error should be filled')
      .toContain('Ingresar nombre del festejado o festejados');

    expect(userIdErrorSpan.nativeElement.innerHTML)
      .withContext('UserId span for error should be filled')
      .toContain('Seleccionar usuario');

    expect(fixture.componentInstance.displayMessage['nameOfEvent'])
      .withContext('NameOfEvent displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['dateOfEvent'])
      .withContext('DateOfEvent displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['maxDateOfConfirmation'])
      .withContext('MaxDateOfConfirmation displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['typeOfEvent'])
      .withContext('TypeOfEvent displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['nameOfCelebrated'])
      .withContext('NameOfCelebrated displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['userId'])
      .withContext('UserId displayMessage should exist')
      .toBeDefined();
  });

  it("Shouldn't display username and password error message when fields are filled", () => {
    updateFormUsingEvent(
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.dateOfEvent,
      EventType.Xv,
      fullEventsMockCopy.userId
    );
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const nameOfEventErrorSpan = errorSpans[0];
    const dateOfEventErrorSpan = errorSpans[1];
    const maxDateOfConfirmationErrorSpan = errorSpans[2];
    const typeOfEventErrorSpan = errorSpans[3];
    const nameOfCelebratedErrorSpan = errorSpans[4];
    const userIdErrorSpan = errorSpans[5];

    expect(nameOfEventErrorSpan.nativeElement.innerHTML)
      .withContext("NameOfEvent span for error should't be filled")
      .not.toContain('Ingresar nombre del evento');

    expect(dateOfEventErrorSpan.nativeElement.innerHTML)
      .withContext("DateOfEvent span for error should't be filled")
      .not.toContain('Ingresar fecha del evento');

    expect(maxDateOfConfirmationErrorSpan.nativeElement.innerHTML)
      .withContext("MaxDateOfConfirmation span for error should't be filled")
      .not.toContain('Ingresar fecha límite de confirmación');

    expect(typeOfEventErrorSpan.nativeElement.innerHTML)
      .withContext("TypeOfEvent span for error should't be filled")
      .not.toContain('Seleccionar tipo de evento');

    expect(nameOfCelebratedErrorSpan.nativeElement.innerHTML)
      .withContext("NameOfCelebrated span for error should't be filled")
      .not.toContain('Ingresar nombre del festejado o festejados');

    expect(userIdErrorSpan.nativeElement.innerHTML)
      .withContext("UserId span for error should't be filled")
      .not.toContain('Seleccionar usuario');

    expect(fixture.componentInstance.displayMessage['nameOfEvent'])
      .withContext('NameOfEvent displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['dateOfEvent'])
      .withContext('DateOfEvent displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['maxDateOfConfirmation'])
      .withContext('MaxDateOfConfirmation displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['typeOfEvent'])
      .withContext('TypeOfEvent displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['nameOfCelebrated'])
      .withContext('NameOfCelebrated displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['userId'])
      .withContext('UserId displayMessage should exist')
      .toBeDefined();
  });
});
