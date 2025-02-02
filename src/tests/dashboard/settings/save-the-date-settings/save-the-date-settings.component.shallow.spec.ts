import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SaveTheDateSettingsComponent } from 'src/app/dashboard/settings/save-the-date-settings/save-the-date-settings.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { saveTheDateSettingMock } from 'src/tests/mocks/mocks';

const saveTheDateSettingMockCopy = deepCopy(saveTheDateSettingMock);

describe('Save The Date Settings Component (Shallow test)', () => {
  let fixture: ComponentFixture<SaveTheDateSettingsComponent>;

  const updateFormUsingEvent = (
    eventId: string,
    primaryColor: string,
    secondaryColor: string,
    receptionPlace: string,
    copyMessage: string,
    hotelName: string,
    hotelInformation: string
  ) => {
    fixture.componentInstance.createEventSettingsForm.patchValue({
      eventId,
    });
    const primaryColorInput = fixture.debugElement.query(
      By.css('#primaryColor')
    );
    const secondaryColorInput = fixture.debugElement.query(
      By.css('#secondaryColor')
    );
    const receptionPlaceInput = fixture.debugElement.query(
      By.css('#receptionPlace')
    );
    const copyMessageInput = fixture.debugElement.query(By.css('#copyMessage'));
    const hotelNameInput = fixture.debugElement.query(By.css('#hotelName'));
    const hotelInformationInput = fixture.debugElement.query(
      By.css('#hotelInformation')
    );

    primaryColorInput.nativeElement.value = primaryColor;
    primaryColorInput.nativeElement.dispatchEvent(new Event('input'));

    secondaryColorInput.nativeElement.value = secondaryColor;
    secondaryColorInput.nativeElement.dispatchEvent(new Event('input'));

    receptionPlaceInput.nativeElement.value = receptionPlace;
    receptionPlaceInput.nativeElement.dispatchEvent(new Event('input'));

    copyMessageInput.nativeElement.value = copyMessage;
    copyMessageInput.nativeElement.dispatchEvent(new Event('input'));

    hotelNameInput.nativeElement.value = hotelName;
    hotelNameInput.nativeElement.dispatchEvent(new Event('input'));

    hotelInformationInput.nativeElement.value = hotelInformation;
    hotelInformationInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [SaveTheDateSettingsComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SettingsService, useValue: settingsSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveTheDateSettingsComponent);
    fixture.detectChanges();
  });

  it('created a form with primaryColor, secondaryColor, receptionPlace, copyMessage, hotelName, hotelInformation, save button, cancel button', () => {
    const primaryColorInput = fixture.debugElement.query(
      By.css('#primaryColor')
    );
    const secondaryColorInput = fixture.debugElement.query(
      By.css('#secondaryColor')
    );
    const receptionPlaceInput = fixture.debugElement.query(
      By.css('#receptionPlace')
    );
    const copyMessageInput = fixture.debugElement.query(By.css('#copyMessage'));
    const hotelNameInput = fixture.debugElement.query(By.css('#hotelName'));
    const hotelInformationInput = fixture.debugElement.query(
      By.css('#hotelInformation')
    );

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[0];
    const cancelButton = buttons[1];

    expect(primaryColorInput)
      .withContext("PrimaryColorInput input shouln't be null")
      .not.toBeNull();
    expect(secondaryColorInput)
      .withContext("SecondaryColorInput input shouln't be null")
      .not.toBeNull();
    expect(receptionPlaceInput)
      .withContext("ReceptionPlaceInput input shouln't be null")
      .not.toBeNull();
    expect(copyMessageInput)
      .withContext("CopyMessageInput input shouln't be null")
      .not.toBeNull();
    expect(hotelNameInput)
      .withContext("HotelNameInput input shouln't be null")
      .not.toBeNull();
    expect(hotelInformationInput)
      .withContext("HotelInformationInput input shouln't be null")
      .not.toBeNull();

    expect(saveButton)
      .withContext("Save button shouldn't be null")
      .not.toBeNull();
    expect(cancelButton)
      .withContext("Cancel button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(
      saveTheDateSettingMockCopy.eventId,
      saveTheDateSettingMockCopy.primaryColor,
      saveTheDateSettingMockCopy.secondaryColor,
      saveTheDateSettingMockCopy.receptionPlace,
      saveTheDateSettingMockCopy.copyMessage,
      saveTheDateSettingMockCopy.hotelName,
      saveTheDateSettingMockCopy.hotelInformation
    );

    const controls = fixture.componentInstance.createEventSettingsForm.controls;

    expect(controls['eventId'].value)
      .withContext('eventId control should be filled when input changes')
      .toBe(saveTheDateSettingMockCopy.eventId);
    expect(controls['primaryColor'].value)
      .withContext('primaryColor control should be filled when input changes')
      .toBe(saveTheDateSettingMockCopy.primaryColor);
    expect(controls['secondaryColor'].value)
      .withContext('secondaryColor control should be filled when input changes')
      .toBe(saveTheDateSettingMockCopy.secondaryColor);
    expect(controls['receptionPlace'].value)
      .withContext('receptionPlace control should be filled when input changes')
      .toBe(saveTheDateSettingMockCopy.receptionPlace);
    expect(controls['copyMessage'].value)
      .withContext('copyMessage control should be filled when input changes')
      .toBe(saveTheDateSettingMockCopy.copyMessage);
    expect(controls['hotelName'].value)
      .withContext('hotelName control should be filled when input changes')
      .toBe(saveTheDateSettingMockCopy.hotelName);
    expect(controls['hotelInformation'].value)
      .withContext(
        'hotelInformation control should be filled when input changes'
      )
      .toBe(saveTheDateSettingMockCopy.hotelInformation);
  });

  it('Expect save button to trigger saveChanges', () => {
    spyOn(fixture.componentInstance, 'saveChanges');
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[1];
    saveButton.nativeElement.click();

    expect(fixture.componentInstance.saveChanges)
      .withContext('SaveChanges method should have been called')
      .toHaveBeenCalled();
  });

  it('Display primaryColor, secondaryColor, receptionPlace, copyMessage, hotelName, hotelInformation error message when fields are blank', () => {
    updateFormUsingEvent('', '', '', '', '', '', '');

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const primaryColorErrorSpan = errorSpans[0];
    const secondaryColorErrorSpan = errorSpans[1];
    const receptionPlaceErrorSpan = errorSpans[2];
    const copyMessageErrorSpan = errorSpans[3];
    const hotelNameErrorSpan = errorSpans[4];
    const hotelInformationErrorSpan = errorSpans[5];

    expect(primaryColorErrorSpan.nativeElement.innerHTML.trim())
      .withContext('primaryColor span error should be filled')
      .toBe('');
    expect(secondaryColorErrorSpan.nativeElement.innerHTML.trim())
      .withContext('secondaryColor span error should be filled')
      .toBe('');
    expect(receptionPlaceErrorSpan.nativeElement.innerHTML)
      .withContext('receptionPlace span error should be filled')
      .toContain('Ingresar lugar del evento');
    expect(copyMessageErrorSpan.nativeElement.innerHTML)
      .withContext('copyMessage span error should be filled')
      .toContain('Ingresar mensaje para copiar');
    expect(hotelNameErrorSpan.nativeElement.innerHTML)
      .withContext('hotelName span error should be filled')
      .toContain('Ingresar nombre del hotel');
    expect(hotelInformationErrorSpan.nativeElement.innerHTML)
      .withContext('hotelInformation span error should be filled')
      .toContain('Ingresar url con información del hotel');

    const displayMessages = fixture.componentInstance.displayMessage;

    expect(displayMessages['primaryColor'])
      .withContext('primaryColor displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['secondaryColor'])
      .withContext('secondaryColor displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['receptionPlace'])
      .withContext('receptionPlace displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['copyMessage'])
      .withContext('copyMessage displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['hotelName'])
      .withContext('hotelName displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['hotelInformation'])
      .withContext('hotelInformation displayMessage should exist')
      .toBeDefined();

    expect(displayMessages['primaryColor'])
      .withContext('Should displayMessage error for primaryColor')
      .toBe('');
    expect(displayMessages['secondaryColor'])
      .withContext('Should displayMessage error for secondaryColor')
      .toBe('');
    expect(displayMessages['receptionPlace'])
      .withContext('Should displayMessage error for receptionPlace')
      .toContain('Ingresar lugar del evento');
    expect(displayMessages['copyMessage'])
      .withContext('Should displayMessage error for copyMessage')
      .toContain('Ingresar mensaje para copiar');
    expect(displayMessages['hotelName'])
      .withContext('Should displayMessage error for hotelName')
      .toContain('Ingresar nombre del hotel');
    expect(displayMessages['hotelInformation'])
      .withContext('Should displayMessage error for hotelInformation')
      .toContain('Ingresar url con información del hotel');
  });

  it("Shouldn't display primaryColor, secondaryColor, receptionPlace, copyMessage, hotelName, hotelInformation error message when fields are filled", () => {
    updateFormUsingEvent(
      saveTheDateSettingMockCopy.eventId,
      saveTheDateSettingMockCopy.primaryColor,
      saveTheDateSettingMockCopy.secondaryColor,
      saveTheDateSettingMockCopy.receptionPlace,
      saveTheDateSettingMockCopy.copyMessage,
      saveTheDateSettingMockCopy.hotelName,
      saveTheDateSettingMockCopy.hotelInformation
    );

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const primaryColorErrorSpan = errorSpans[0];
    const secondaryColorErrorSpan = errorSpans[1];
    const receptionPlaceErrorSpan = errorSpans[2];
    const copyMessageErrorSpan = errorSpans[3];
    const hotelNameErrorSpan = errorSpans[4];
    const hotelInformationErrorSpan = errorSpans[5];

    expect(primaryColorErrorSpan.nativeElement.innerHTML.trim())
      .withContext("primaryColor span error shouldn't be filled")
      .toBe('');
    expect(secondaryColorErrorSpan.nativeElement.innerHTML.trim())
      .withContext("secondaryColor span error shouldn't be filled")
      .toBe('');
    expect(receptionPlaceErrorSpan.nativeElement.innerHTML)
      .withContext("receptionPlace span error shouldn't be filled")
      .not.toContain('Ingresar lugar del evento');
    expect(copyMessageErrorSpan.nativeElement.innerHTML)
      .withContext("copyMessage span error shouldn't be filled")
      .not.toContain('Ingresar mensaje para copiar');
    expect(hotelNameErrorSpan.nativeElement.innerHTML)
      .withContext("hotelName span error shouldn't be filled")
      .not.toContain('Ingresar nombre del hotel');
    expect(hotelInformationErrorSpan.nativeElement.innerHTML)
      .withContext("hotelInformation span error shouldn't be filled")
      .not.toContain('Ingresar url con información del hotel');

    const displayMessages = fixture.componentInstance.displayMessage;

    expect(displayMessages['primaryColor'])
      .withContext('primaryColor displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['secondaryColor'])
      .withContext('secondaryColor displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['receptionPlace'])
      .withContext('receptionPlace displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['copyMessage'])
      .withContext('copyMessage displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['hotelName'])
      .withContext('hotelName displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['hotelInformation'])
      .withContext('hotelInformation displayMessage should exist')
      .toBeDefined();

    expect(displayMessages['primaryColor'])
      .withContext("Shouldn't displayMessage error for primaryColor")
      .toBe('');
    expect(displayMessages['secondaryColor'])
      .withContext("Shouldn't displayMessage error for secondaryColor")
      .toBe('');
    expect(displayMessages['receptionPlace'])
      .withContext("Shouldn't displayMessage error for receptionPlace")
      .not.toContain('Ingresar lugar del evento');
    expect(displayMessages['copyMessage'])
      .withContext("Shouldn't displayMessage error for copyMessage")
      .not.toContain('Ingresar mensaje para copiar');
    expect(displayMessages['hotelName'])
      .withContext("Shouldn't displayMessage error for hotelName")
      .not.toContain('Ingresar nombre del hotel');
    expect(displayMessages['hotelInformation'])
      .withContext("Shouldn't displayMessage error for hotelInformation")
      .not.toContain('Ingresar url con información del hotel');
  });
});
