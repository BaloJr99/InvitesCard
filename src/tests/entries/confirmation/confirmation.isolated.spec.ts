import { FormBuilder, Validators } from "@angular/forms";
import { ConfirmationComponent } from "src/app/entries/confirmation/confirmation.component";
import { canceledEmptyMessageEntryConfirmation, emptyMessageEntryConfirmation, entryConfirmed, validEntryConfirmation } from "src/tests/mocks/mock";

const entriesServiceSpy = jasmine.createSpyObj('EntriesService', ['sendConfirmation']);
const socketServiceSpy = jasmine.createSpyObj('SocketService', ['sendNotification']);
const loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['setLoading']);

describe('Confirmation Component: Isolated Test', () => {
  let component: ConfirmationComponent;

  const updateForm = (confirmation: boolean, entriesConfirmed: number, message: string) => {
    component.confirmationForm.controls['confirmation'].setValue(confirmation);
    component.confirmationForm.controls['entriesConfirmed'].setValue(entriesConfirmed);
    component.confirmationForm.controls['message'].setValue(message);
  }

  beforeEach(() => {
    component = new ConfirmationComponent(
      new FormBuilder(),
      entriesServiceSpy,
      socketServiceSpy,
      loaderServiceSpy
    )
  })

  it("Should render the component", () => {
    expect(component)
      .withContext("Component should exist")
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.confirmationForm)
      .withContext("ConfirmationForm should exist")
      .toBeDefined();
    expect(component.entry)
      .withContext("Entry variable should exist")
      .not.toBeDefined();
    expect(component.confirmationForm.invalid)
      .withContext("ConfirmationForm initial value should be invalid")
      .toBeTruthy();
    expect(component.displayMessage)
      .withContext("Display Messages Array should be empty")
      .toEqual({});
    expect(component.numberOfEntries$)
      .withContext("Number of entries observable should be defined")
      .toBeDefined();
  });

  it('form value should be invalid if no entry number is selected', () => {
    component.entry = entryConfirmed;

    expect(component.confirmationForm.invalid)
      .withContext("Form should be invalid when number of entries is not valid")
      .toBeTruthy();
  });
  
  it('form should be valid if no message is typed', () => {
    updateForm(
      emptyMessageEntryConfirmation.confirmation, 
      emptyMessageEntryConfirmation.entriesConfirmed,
      emptyMessageEntryConfirmation.message);
      
    expect(component.confirmationForm.valid)
      .withContext("Form should be valid")
      .toBeTruthy();
  });

  it('form should be valid if no message is typed and it is canceled', () => {
    updateForm(
      canceledEmptyMessageEntryConfirmation.confirmation, 
      canceledEmptyMessageEntryConfirmation.entriesConfirmed,
      canceledEmptyMessageEntryConfirmation.message);
      
    expect(component.confirmationForm.valid)
      .withContext("Form should be valid")
      .toBeTruthy();
  });
  
  it('form should be valid if message is typed', () => {
    updateForm(
      validEntryConfirmation.confirmation, 
      validEntryConfirmation.entriesConfirmed,
      validEntryConfirmation.message);
      
    expect(component.confirmationForm.valid)
      .withContext("Form should be valid")
      .toBeTruthy();
  });

  it('should have confirmation in the confirmationForm', () => {
    const confirmation = component.confirmationForm.controls["confirmation"];
    expect(confirmation.valid)
      .withContext("Confirmation should be valid")
      .toBeTrue();

    expect(confirmation.errors)
      .withContext("Confirmation shouldn't have errors")
      .toBeNull();

    expect(confirmation.hasValidator(Validators.required))
      .withContext("Should contain the required validator")
      .toBeTrue();
  });

  it('should have entriesConfirmed in the confirmationForm', () => {
    const entriesConfirmed = component.confirmationForm.controls["entriesConfirmed"];
    expect(entriesConfirmed.invalid)
      .withContext("entriesConfirmed should be invalid")
      .toBeTrue();

    expect(entriesConfirmed.errors?.['required'])
      .withContext("entriesConfirmed should be required")
      .toBeTrue();

    expect(entriesConfirmed.hasValidator(Validators.required))
      .withContext("Should contain the required validator")
      .toBeTrue();
  });

  it('should have message in the confirmationForm', () => {
    const message = component.confirmationForm.controls["message"];
    expect(message.valid)
      .withContext("message should be valid")
      .toBeTrue();

    expect(message.errors)
      .withContext("message shouldn't have errors")
      .toBeNull();

    expect(message.hasValidator(Validators.required))
      .withContext("Shouldn't contain the required validator")
      .toBeFalse();
  });
});