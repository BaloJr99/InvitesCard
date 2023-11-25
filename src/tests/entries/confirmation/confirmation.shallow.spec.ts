import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { ConfirmationComponent } from "src/app/entries/confirmation/confirmation.component";
import { EntriesService } from "src/core/services/entries.service";
import { canceledEmptyMessageEntryConfirmation, canceledEntryConfirmation, emptyConfirmationEntry, emptyMessageEntryConfirmation, invalidEntryConfirmation, validEntryConfirmation } from "src/tests/mocks/mock";

let entriesServiceSpy = jasmine.createSpyObj('EntriesService', ['sendConfirmation']);

describe('Confirmation Component: Shallow Test', () => {
  let fixture: ComponentFixture<ConfirmationComponent>;

  const updateFormUsingEvent = (confirmation: boolean, entriesConfirmed: number | string, message: string | null) => {
    const confirmationInput = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    const entriesConfirmedDropdown = fixture.debugElement.query(By.css("select"));
    const messageTextArea = fixture.debugElement.query(By.css("textarea"));
    
    if (confirmation) {
      confirmationInput[0].nativeElement.value = confirmation;
      confirmationInput[0].nativeElement.dispatchEvent(new Event('change'));
    } else {
      confirmationInput[1].nativeElement.value = confirmation;
      confirmationInput[1].nativeElement.dispatchEvent(new Event('change'));
    }

    entriesConfirmedDropdown.nativeElement.value = entriesConfirmed;
    entriesConfirmedDropdown.nativeElement.dispatchEvent(new Event('change'));

    messageTextArea.nativeElement.value = message;
    messageTextArea.nativeElement.dispatchEvent(new Event('input'));

    const form = fixture.debugElement.query(By.css('form'))
    form.triggerEventHandler('submit');

    fixture.detectChanges();
  };

  beforeEach(() => {
    entriesServiceSpy = jasmine.createSpyObj('EntriesService', ['sendConfirmation']);
    TestBed.configureTestingModule({
      declarations: [
        ConfirmationComponent
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: EntriesService, useValue: entriesServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(ConfirmationComponent);

    fixture.componentInstance.entry = emptyConfirmationEntry;

    fixture.detectChanges();

    fixture.componentInstance.ngOnChanges({
      entry: new SimpleChange(null, emptyConfirmationEntry, true)
    });

    fixture.detectChanges();
  });

  it('created a form with confirmationRadioButtons, entriesConfirmedDropdown, messageTextArea', () => {
    const confirmationRadio = fixture.debugElement.query(By.css("#confirmation"));
    const entriesConfirmedDropdown = fixture.debugElement.query(By.css('#entriesConfirmed'));
    const messageTextarea = fixture.debugElement.query(By.css('#message'));
    const confirmationButton = fixture.debugElement.query(By.css('#sendConfirmation'));

    expect(confirmationRadio)
      .withContext("Confirmation radio buttons should be defined")
      .toBeDefined();
    expect(entriesConfirmedDropdown)
      .withContext("Entries Confirmed dropdown should be defined")
      .toBeDefined();
    expect(messageTextarea)
      .withContext("Message textarea should be defined")
      .toBeDefined();
    expect(confirmationButton)
      .withContext("Confirmation Button should be defined")
      .toBeDefined();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    entriesServiceSpy.sendConfirmation.and.returnValue(of());
    updateFormUsingEvent(
      validEntryConfirmation.confirmation, 
      validEntryConfirmation.entriesConfirmed,
      validEntryConfirmation.message);

    fixture.detectChanges();

    expect(fixture.componentInstance.confirmationForm.controls['confirmation'].value)
      .withContext("Confirmation control should be filled when input changes")
      .toBeTruthy();

    expect(fixture.componentInstance.confirmationForm.controls['entriesConfirmed'].value)
      .withContext("EntriesConfirmed control should be filled when input changes")
      .toBe(validEntryConfirmation.entriesConfirmed);

    expect(fixture.componentInstance.confirmationForm.controls['message'].value)
      .withContext("Message control should be filled when input changes")
      .toBe(validEntryConfirmation.message);
  });

  it('Expect form on submit to trigger saveInformation', () => {
    spyOn(fixture.componentInstance, 'saveInformation');
    const form = fixture.debugElement.query(By.css('form'))
    form.triggerEventHandler('submit');
    fixture.detectChanges();
    expect(fixture.componentInstance.saveInformation)
      .withContext("SaveInformation method should have been called")
      .toHaveBeenCalled();
  });

  it('Display select entry number error message when fields are blank', () => {
    updateFormUsingEvent(
      invalidEntryConfirmation.confirmation, 
      invalidEntryConfirmation.entriesConfirmed,
      invalidEntryConfirmation.message);
    
    const errorSpans = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    const entriesConfirmedErrorSpan = errorSpans[0];

    expect(entriesConfirmedErrorSpan.nativeElement.innerHTML)
      .withContext("EntrieConfirmed span for error should be filled")
      .toContain("Favor de seleccionar");

    expect(fixture.componentInstance.displayMessage["entriesConfirmed"])
      .withContext("EntriesConfirmed displayMessage should exist")
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage["entriesConfirmed"])
      .withContext("Should displayMessage error for entriesConfirmed")
      .toContain("Favor de seleccionar");
  });

  it('Shouldn\'t display entryNumber error message when fields are filled', () => {
    entriesServiceSpy.sendConfirmation.and.returnValue(of());
    updateFormUsingEvent(
      validEntryConfirmation.confirmation, 
      validEntryConfirmation.entriesConfirmed,
      validEntryConfirmation.message);

    const form = fixture.debugElement.query(By.css('form'))
    form.triggerEventHandler('submit');

    fixture.detectChanges();
    
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    const entriesConfirmedErrorSpan = errorSpans[0];

    expect(entriesConfirmedErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain("Favor de seleccionar");

    expect(fixture.componentInstance.displayMessage["entriesConfirmed"])
    .withContext("Username displayMessage should exist")
    .toBeDefined();

    expect(fixture.componentInstance.displayMessage["entriesConfirmed"])
      .withContext("DisplayMessage for username shouldn't contain error")
      .not.toContain("Favor de seleccionar");
  });

  it('Shouldn\'t display entryNumber error message when entryConfirmation is false', () => {
    entriesServiceSpy.sendConfirmation.and.returnValue(of());
    updateFormUsingEvent(
      canceledEntryConfirmation.confirmation, 
      canceledEntryConfirmation.entriesConfirmed,
      canceledEntryConfirmation.message);
    
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    const entriesConfirmedErrorSpan = errorSpans[0];

    expect(entriesConfirmedErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain("Favor de seleccionar");

    expect(fixture.componentInstance.displayMessage["entriesConfirmed"])
    .withContext("EntriesConfirmed displayMessage should exist")
    .toBeDefined();

    expect(fixture.componentInstance.displayMessage["entriesConfirmed"])
      .withContext("DisplayMessage for entriesConfirmed shouldn't contain error")
      .not.toContain("Favor de seleccionar");
  });

  it('Shouldn\'t display error message when entryConfirmation is true and message is null', () => {
    entriesServiceSpy.sendConfirmation.and.returnValue(of());
    updateFormUsingEvent(
      emptyMessageEntryConfirmation.confirmation, 
      emptyMessageEntryConfirmation.entriesConfirmed,
      emptyMessageEntryConfirmation.message);
    
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    const entriesConfirmedErrorSpan = errorSpans[0];

    expect(entriesConfirmedErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain("Favor de seleccionar");

    expect(fixture.componentInstance.displayMessage["entriesConfirmed"])
    .withContext("EntriesConfirmed displayMessage should exist")
    .toBeDefined();

    expect(fixture.componentInstance.displayMessage["entriesConfirmed"])
      .withContext("DisplayMessage for entriesConfirmed shouldn't contain error")
      .not.toContain("Favor de seleccionar");
  });

  it('Shouldn\'t display error message when entryConfirmation is false and message is null', () => {
    entriesServiceSpy.sendConfirmation.and.returnValue(of());
    updateFormUsingEvent(
      canceledEmptyMessageEntryConfirmation.confirmation, 
      canceledEmptyMessageEntryConfirmation.entriesConfirmed,
      canceledEmptyMessageEntryConfirmation.message);
    
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(By.css('.invalid-feedback'));
    const entriesConfirmedErrorSpan = errorSpans[0];

    expect(entriesConfirmedErrorSpan.nativeElement.innerHTML)
      .withContext("Shouldn't display error message")
      .not.toContain("Favor de seleccionar");

    expect(fixture.componentInstance.displayMessage["entriesConfirmed"])
    .withContext("EntriesConfirmed displayMessage should exist")
    .toBeDefined();

    expect(fixture.componentInstance.displayMessage["entriesConfirmed"])
      .withContext("DisplayMessage for entriesConfirmed shouldn't contain error")
      .not.toContain("Favor de seleccionar");
  });
});