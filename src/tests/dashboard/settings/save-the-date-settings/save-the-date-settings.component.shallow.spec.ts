import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SaveTheDateSettingsComponent } from 'src/app/dashboard/settings/save-the-date-settings/save-the-date-settings.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  saveTheDateBaseSettingMock,
  saveTheDateSettingMock,
} from 'src/tests/mocks/mocks';

const saveTheDateSettingMockCopy = deepCopy(saveTheDateSettingMock);
const saveTheDateBaseSettingMockCopy = deepCopy(saveTheDateBaseSettingMock);

describe('Save The Date Settings Component (Shallow test)', () => {
  let fixture: ComponentFixture<SaveTheDateSettingsComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  const updateFormUsingEvent = (
    primaryColor: string,
    secondaryColor: string,
    receptionPlace: string,
    copyMessage: string,
    hotelName: string,
    hotelInformation: string
  ) => {
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

  beforeEach(async () => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', [
      'getEventSettings',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ValidationPipe,
        ValidationErrorPipe,
        SaveTheDateSettingsComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SettingsService, useValue: settingsSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    settingsServiceSpy = TestBed.inject(
      SettingsService
    ) as jasmine.SpyObj<SettingsService>;

    settingsServiceSpy.getEventSettings.and.returnValue(
      of(saveTheDateBaseSettingMockCopy)
    );
    fixture = TestBed.createComponent(SaveTheDateSettingsComponent);
    fixture.componentRef.setInput(
      'eventSettingActionValue',
      saveTheDateSettingMockCopy
    );
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
    updateFormUsingEvent('', '', '', '', '', '');
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[1];
    saveButton.nativeElement.click();

    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const receptionPlaceErrorSpan = errorSpans[0];
    const copyMessageErrorSpan = errorSpans[1];
    const hotelNameErrorSpan = errorSpans[2];
    const hotelInformationErrorSpan = errorSpans[3];

    expect(receptionPlaceErrorSpan.nativeElement.innerHTML)
      .withContext('receptionPlace span error should be filled')
      .toContain('El lugar del evento es requerido');
    expect(copyMessageErrorSpan.nativeElement.innerHTML)
      .withContext('copyMessage span error should be filled')
      .toContain('El mensaje es requerido');
    expect(hotelNameErrorSpan.nativeElement.innerHTML)
      .withContext('hotelName span error should be filled')
      .toContain('El nombre del hotel es requerido');
    expect(hotelInformationErrorSpan.nativeElement.innerHTML)
      .withContext('hotelInformation span error should be filled')
      .toContain('La información del hotel es requerida');
  });

  it("Shouldn't display primaryColor, secondaryColor, receptionPlace, copyMessage, hotelName, hotelInformation error message when fields are filled", () => {
    updateFormUsingEvent(
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

    expect(errorSpans.length)
      .withContext('There should be no error messages')
      .toBe(0);
  });
});
