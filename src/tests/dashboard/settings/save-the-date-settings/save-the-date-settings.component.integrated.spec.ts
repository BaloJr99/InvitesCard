import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { EventType } from 'src/app/core/models/enum';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SaveTheDateSettingsComponent } from 'src/app/dashboard/settings/save-the-date-settings/save-the-date-settings.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  fullEventsMock,
  messageResponseMock,
  saveTheDateBaseSettingMock,
  saveTheDateSettingMock,
} from 'src/tests/mocks/mocks';

const fullEventsMockCopy = deepCopy(fullEventsMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);
const saveTheDateBaseSettingMockCopy = deepCopy(saveTheDateBaseSettingMock);
const saveTheDateSettingMockCopy = deepCopy(saveTheDateSettingMock);

describe('Save The Date Settings (Integrated Test)', () => {
  let fixture: ComponentFixture<SaveTheDateSettingsComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

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

  beforeEach(async () => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', [
      'getEventSettings',
      'createEventSettings',
      'updateEventSettings',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ValidationPipe,
        ValidationErrorPipe,
        SaveTheDateSettingsComponent,
      ],
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
    fixture.componentRef.setInput('eventSettingActionValue', {
      eventId: fullEventsMockCopy.id,
      eventTypwe: EventType.SaveTheDate,
      isNew: true,
    });
    fixture.detectChanges();
  });

  it('should call getEventSettings() when parent component sends Input value', () => {
    expect(settingsServiceSpy.getEventSettings)
      .withContext(
        "getEventSettings method from SettingsService should've been called"
      )
      .toHaveBeenCalled();
  });

  it('should call createEventSettings when the event setting is new', () => {
    fixture.componentRef.setInput('eventSettingActionValue', {
      eventId: fullEventsMockCopy.id,
      eventType: EventType.SaveTheDate,
      isNew: true,
    });

    settingsServiceSpy.getEventSettings.and.returnValue(of());
    settingsServiceSpy.createEventSettings.and.returnValue(
      of(messageResponseMockCopy)
    );

    updateFormUsingEvent(
      saveTheDateSettingMockCopy.eventId,
      saveTheDateSettingMockCopy.primaryColor,
      saveTheDateSettingMockCopy.secondaryColor,
      saveTheDateSettingMockCopy.receptionPlace,
      saveTheDateSettingMockCopy.copyMessage,
      saveTheDateSettingMockCopy.hotelName,
      saveTheDateSettingMockCopy.hotelInformation
    );

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[1];
    saveButton.nativeElement.click();

    expect(settingsServiceSpy.createEventSettings)
      .withContext(
        "createEventSettings method from SettingsService should've been called"
      )
      .toHaveBeenCalled();
  });

  it('should call updateEventSettings when the event setting is not', () => {
    fixture.componentRef.setInput('eventSettingActionValue', {
      eventId: fullEventsMockCopy.id,
      eventType: EventType.SaveTheDate,
      isNew: false,
    });

    settingsServiceSpy.getEventSettings.and.returnValue(of());
    settingsServiceSpy.updateEventSettings.and.returnValue(
      of(messageResponseMockCopy)
    );

    updateFormUsingEvent(
      saveTheDateSettingMockCopy.eventId,
      saveTheDateSettingMockCopy.primaryColor,
      saveTheDateSettingMockCopy.secondaryColor,
      saveTheDateSettingMockCopy.receptionPlace,
      saveTheDateSettingMockCopy.copyMessage,
      saveTheDateSettingMockCopy.hotelName,
      saveTheDateSettingMockCopy.hotelInformation
    );

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[1];
    saveButton.nativeElement.click();

    expect(settingsServiceSpy.updateEventSettings)
      .withContext(
        "updateEventSettings method from SettingsService should've been called"
      )
      .toHaveBeenCalled();
  });
});
