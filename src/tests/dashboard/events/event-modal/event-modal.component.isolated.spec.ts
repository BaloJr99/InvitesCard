import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DesignType, EventType } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/common-modal.service';
import { DesignsService } from 'src/app/core/services/design.service';
import { EventTypesService } from 'src/app/core/services/event-types.service';
import { EventsService } from 'src/app/core/services/events.service';
import { UsersService } from 'src/app/core/services/users.service';
import { EventModalComponent } from 'src/app/dashboard/events/event-modal/event-modal.component';
import { deepCopy, toLocalDate } from 'src/app/shared/utils/tools';
import { fullEventsMock } from 'src/tests/mocks/mocks';

let fullEventsMockCopy = deepCopy(fullEventsMock);

describe('Event Modal Component (Isolated Test)', () => {
  fullEventsMockCopy = {
    ...fullEventsMockCopy,
    dateOfEvent: toLocalDate(fullEventsMockCopy.dateOfEvent).substring(0, 10),
    maxDateOfConfirmation: toLocalDate(
      fullEventsMockCopy.maxDateOfConfirmation,
    ).substring(0, 10),
  };

  let component: EventModalComponent;
  const eventsSpy = jasmine.createSpyObj('EventsService', ['']);
  const usersSpy = jasmine.createSpyObj('UsersService', [
    'getUsersDropdownData',
  ]);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
  const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['']);
  const eventTypesSpy = jasmine.createSpyObj('EventTypesService', [
    'getEventTypes',
  ]);
  const designsSpy = jasmine.createSpyObj('DesignsService', ['getDesigns']);

  const updateForm = (
    nameOfEvent: string,
    dateOfEvent: string,
    maxDateOfConfirmation: string,
    nameOfCelebrated: string,
    eventTypeId: EventType,
    designId: string,
    userId: string,
  ) => {
    component.createEventForm.controls['nameOfEvent'].setValue(nameOfEvent);
    component.createEventForm.controls['dateOfEvent'].setValue(dateOfEvent);
    component.createEventForm.controls['maxDateOfConfirmation'].setValue(
      maxDateOfConfirmation,
    );
    component.createEventForm.controls['nameOfCelebrated'].setValue(
      nameOfCelebrated,
    );
    component.createEventForm.controls['eventTypeId'].setValue(eventTypeId);
    component.createEventForm.controls['designId'].setValue(designId);
    component.createEventForm.controls['userId'].setValue(userId);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: EventsService, useValue: eventsSpy },
        { provide: UsersService, useValue: usersSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: CommonModalService, useValue: commonModalSpy },
        { provide: EventTypesService, useValue: eventTypesSpy },
        { provide: DesignsService, useValue: designsSpy },
      ],
    });

    component = TestBed.createComponent(EventModalComponent).componentInstance;
  });

  it('should create', () => {
    expect(component)
      .withContext('Component should have been created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.createEventForm)
      .withContext('should have createEventForm to be defined')
      .toBeDefined();

    expect(component.originalEventTypeId)
      .withContext('should have originalEventType to be undefined')
      .toBe('');

    expect(component.userEmptyMessage)
      .withContext('should have userEmptyMessage to be an empty string')
      .toBe('');
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', '', '', '', EventType.None, DesignType.None, '');
    expect(component.createEventForm.invalid)
      .withContext('Form should be invalid when any field is not valid')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(
      fullEventsMockCopy.nameOfEvent,
      fullEventsMockCopy.dateOfEvent,
      fullEventsMockCopy.maxDateOfConfirmation,
      fullEventsMockCopy.nameOfCelebrated,
      EventType.Xv,
      DesignType.Classic,
      fullEventsMockCopy.userId,
    );

    expect(component.createEventForm.valid)
      .withContext('Form should be valid')
      .toBeTruthy();
  });

  it('should have nameOfEvent in the createEventForm', () => {
    const nameOfEvent = component.createEventForm.controls['nameOfEvent'];

    expect(nameOfEvent.valid)
      .withContext('nameOfEvent should be invalid')
      .toBeFalsy();
    expect(nameOfEvent.errors?.['required'])
      .withContext('nameOfEvent should be required')
      .toBeTruthy();
  });

  it('should have dateOfEvent in the createEventForm', () => {
    const dateOfEvent = component.createEventForm.controls['dateOfEvent'];
    expect(dateOfEvent.valid)
      .withContext('dateOfEvent should be invalid')
      .toBeFalsy();

    expect(dateOfEvent.errors?.['required'])
      .withContext('dateOfEvent should be required')
      .toBeTruthy();
  });

  it('should have maxDateOfConfirmation in the createEventForm', () => {
    const maxDateOfConfirmation =
      component.createEventForm.controls['maxDateOfConfirmation'];
    expect(maxDateOfConfirmation.valid)
      .withContext('maxDateOfConfirmation should be invalid')
      .toBeFalsy();

    expect(maxDateOfConfirmation.errors?.['required'])
      .withContext('maxDateOfConfirmation should be required')
      .toBeTruthy();
  });

  it('should have nameOfCelebrated in the createEventForm', () => {
    const nameOfCelebrated =
      component.createEventForm.controls['nameOfCelebrated'];
    expect(nameOfCelebrated.valid)
      .withContext('nameOfCelebrated should be invalid')
      .toBeFalsy();

    expect(nameOfCelebrated.errors?.['required'])
      .withContext('nameOfCelebrated should be required')
      .toBeTruthy();
  });

  it('should have eventTypeId in the createEventForm', () => {
    const eventTypeId = component.createEventForm.controls['eventTypeId'];
    expect(eventTypeId.valid)
      .withContext('eventTypeId should be invalid')
      .toBeFalsy();

    expect(eventTypeId.errors?.['required'])
      .withContext('eventTypeId should be required')
      .toBeTruthy();
  });

  it('should have designId in the createEventForm', () => {
    const designId = component.createEventForm.controls['designId'];
    expect(designId.valid)
      .withContext('designId should be invalid')
      .toBeFalsy();

    expect(designId.errors?.['required'])
      .withContext('designId should be required')
      .toBeTruthy();
  });

  it('should have userId in the createEventForm', () => {
    const userId = component.createEventForm.controls['userId'];
    expect(userId.valid).withContext('userId should be invalid').toBeFalsy();

    expect(userId.errors?.['required'])
      .withContext('userId should be required')
      .toBeTruthy();
  });
});
