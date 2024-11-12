import { FormBuilder } from '@angular/forms';
import { EventType } from 'src/app/core/models/enum';
import { EventModalComponent } from 'src/app/dashboard/events/event-modal/event-modal.component';
import { fullEventsMock } from 'src/tests/mocks/mocks';

describe('Event Modal Component (Isolated Test)', () => {
  let component: EventModalComponent;

  const updateForm = (
    nameOfEvent: string,
    dateOfEvent: string,
    maxDateOfConfirmation: string,
    nameOfCelebrated: string,
    typeOfEvent: EventType,
    userId: string
  ) => {
    component.createEventForm.controls['nameOfEvent'].setValue(nameOfEvent);
    component.createEventForm.controls['dateOfEvent'].setValue(dateOfEvent);
    component.createEventForm.controls['maxDateOfConfirmation'].setValue(
      maxDateOfConfirmation
    );
    component.createEventForm.controls['nameOfCelebrated'].setValue(
      nameOfCelebrated
    );
    component.createEventForm.controls['typeOfEvent'].setValue(typeOfEvent);
    component.createEventForm.controls['userId'].setValue(userId);
  };

  beforeEach(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', ['']);
    const usersSpy = jasmine.createSpyObj('UsersService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['']);
    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', [
      '',
    ]);

    component = new EventModalComponent(
      eventsSpy,
      usersSpy,
      new FormBuilder(),
      toastrSpy,
      loaderSpy,
      commonModalSpy,
      changeDetectorRefSpy
    );
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

    expect(component.originalEventType)
      .withContext('should have originalEventType to be undefined')
      .toBeUndefined();

    expect(component.users)
      .withContext('should have users to be an empty array')
      .toEqual([]);

    expect(component.userEmptyMessage)
      .withContext('should have userEmptyMessage to be an empty string')
      .toBe('');

    expect(component.displayMessage)
      .withContext('should have displayMessage to be an empty object')
      .toEqual({});
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', '', '', '', EventType.None, '');
    expect(component.createEventForm.invalid)
      .withContext('Form should be invalid when any field is not valid')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(
      fullEventsMock.nameOfEvent,
      fullEventsMock.dateOfEvent,
      fullEventsMock.maxDateOfConfirmation,
      fullEventsMock.nameOfCelebrated,
      EventType.Xv,
      fullEventsMock.userId
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

  it('should have typeOfEvent in the createEventForm', () => {
    const typeOfEvent = component.createEventForm.controls['typeOfEvent'];
    expect(typeOfEvent.valid)
      .withContext('typeOfEvent should be invalid')
      .toBeFalsy();

    expect(typeOfEvent.errors?.['required'])
      .withContext('typeOfEvent should be required')
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
