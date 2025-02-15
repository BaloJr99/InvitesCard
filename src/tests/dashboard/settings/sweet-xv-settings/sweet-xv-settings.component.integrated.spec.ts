import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { EventType } from 'src/app/core/models/enum';
import { EventsService } from 'src/app/core/services/events.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SweetXvSettingsComponent } from 'src/app/dashboard/settings/sweet-xv-settings/sweet-xv-settings.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy, toLocalDate } from 'src/app/shared/utils/tools';
import {
  fullEventsMock,
  messageResponseMock,
  sweetXvBaseSettingMock,
  sweetXvSettingMock,
} from 'src/tests/mocks/mocks';

const fullEventsMockCopy = deepCopy(fullEventsMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);
const sweetXvBaseSettingMockCopy = deepCopy(sweetXvBaseSettingMock);
const sweetXvSettingMockCopy = deepCopy(sweetXvSettingMock);

describe('Sweet Xv Settings (Integrated Test)', () => {
  let fixture: ComponentFixture<SweetXvSettingsComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;

  const updateFormUsingEvent = (
    primaryColor: string,
    secondaryColor: string,
    parents: string,
    godParents: string,
    firstSectionSentences: string,
    secondSectionSentences: string,
    massUrl: string,
    massTime: string,
    massAddress: string,
    receptionUrl: string,
    receptionTime: string,
    receptionPlace: string,
    receptionAddress: string,
    dressCodeColor: string
  ) => {
    const primaryColorInput = fixture.debugElement.query(
      By.css('#primaryColor')
    );
    const secondaryColorInput = fixture.debugElement.query(
      By.css('#secondaryColor')
    );
    const parentsInput = fixture.debugElement.query(By.css('#parents'));
    const godParentsInput = fixture.debugElement.query(By.css('#godParents'));
    const firstSectionSentencesInput = fixture.debugElement.query(
      By.css('#firstSectionSentences')
    );
    const secondSectionSentencesInput = fixture.debugElement.query(
      By.css('#secondSectionSentences')
    );
    const massUrlInput = fixture.debugElement.query(By.css('#massUrl'));
    const massTimeInput = fixture.debugElement.query(By.css('#massTime'));
    const massAddressInput = fixture.debugElement.query(By.css('#massAddress'));
    const receptionUrlInput = fixture.debugElement.query(
      By.css('#receptionUrl')
    );
    const receptionTimeInput = fixture.debugElement.query(
      By.css('#receptionTime')
    );
    const receptionPlaceInput = fixture.debugElement.query(
      By.css('#receptionPlace')
    );
    const receptionAddressInput = fixture.debugElement.query(
      By.css('#receptionAddress')
    );
    const dressCodeColorInput = fixture.debugElement.query(
      By.css('#dressCodeColor')
    );

    primaryColorInput.nativeElement.value = primaryColor;
    primaryColorInput.nativeElement.dispatchEvent(new Event('input'));

    secondaryColorInput.nativeElement.value = secondaryColor;
    secondaryColorInput.nativeElement.dispatchEvent(new Event('input'));

    parentsInput.nativeElement.value = parents;
    parentsInput.nativeElement.dispatchEvent(new Event('input'));

    godParentsInput.nativeElement.value = godParents;
    godParentsInput.nativeElement.dispatchEvent(new Event('input'));

    firstSectionSentencesInput.nativeElement.value = firstSectionSentences;
    firstSectionSentencesInput.nativeElement.dispatchEvent(new Event('input'));

    secondSectionSentencesInput.nativeElement.value = secondSectionSentences;
    secondSectionSentencesInput.nativeElement.dispatchEvent(new Event('input'));

    massUrlInput.nativeElement.value = massUrl;
    massUrlInput.nativeElement.dispatchEvent(new Event('input'));

    massTimeInput.nativeElement.value = massTime;
    massTimeInput.nativeElement.dispatchEvent(new Event('input'));

    massAddressInput.nativeElement.value = massAddress;
    massAddressInput.nativeElement.dispatchEvent(new Event('input'));

    receptionUrlInput.nativeElement.value = receptionUrl;
    receptionUrlInput.nativeElement.dispatchEvent(new Event('input'));

    receptionTimeInput.nativeElement.value = receptionTime;
    receptionTimeInput.nativeElement.dispatchEvent(new Event('input'));

    receptionPlaceInput.nativeElement.value = receptionPlace;
    receptionPlaceInput.nativeElement.dispatchEvent(new Event('input'));

    receptionAddressInput.nativeElement.value = receptionAddress;
    receptionAddressInput.nativeElement.dispatchEvent(new Event('input'));

    dressCodeColorInput.nativeElement.value = dressCodeColor;
    dressCodeColorInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', [
      'getEventSettings',
      'createEventSettings',
      'updateEventSettings',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const eventsSpy = jasmine.createSpyObj('EventsService', ['getEventById']);

    TestBed.configureTestingModule({
      declarations: [SweetXvSettingsComponent],
      imports: [ReactiveFormsModule, ValidationPipe, ValidationErrorPipe],
      providers: [
        { provide: SettingsService, useValue: settingsSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: EventsService, useValue: eventsSpy },
      ],
    }).compileComponents();

    settingsServiceSpy = TestBed.inject(
      SettingsService
    ) as jasmine.SpyObj<SettingsService>;

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;
  }));

  beforeEach(() => {
    settingsServiceSpy.getEventSettings.and.returnValue(
      of(sweetXvBaseSettingMockCopy)
    );
    eventsServiceSpy.getEventById.and.returnValue(of(fullEventsMockCopy));

    fixture = TestBed.createComponent(SweetXvSettingsComponent);
    fixture.componentRef.setInput('eventSettingActionValue', {
      eventId: fullEventsMockCopy.id,
      eventType: EventType.Xv,
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
    settingsServiceSpy.createEventSettings.and.returnValue(
      of(messageResponseMockCopy)
    );

    const dateOfReceptionTime =
      sweetXvSettingMockCopy.receptionTime.split(' ')[0];
    const timeOfReceptionTime =
      sweetXvSettingMockCopy.receptionTime.split(' ')[1];
    const receptionTime = toLocalDate(
      `${dateOfReceptionTime}T${timeOfReceptionTime}.000Z`
    )
      .split('T')[1]
      .substring(0, 5);

    const dateOfMassTime = sweetXvSettingMockCopy.massTime.split(' ')[0];
    const timeOfMassTime = sweetXvSettingMockCopy.massTime.split(' ')[1];
    const massTime = toLocalDate(`${dateOfMassTime}T${timeOfMassTime}.000Z`)
      .split('T')[1]
      .substring(0, 5);

    updateFormUsingEvent(
      sweetXvSettingMockCopy.primaryColor,
      sweetXvSettingMockCopy.secondaryColor,
      sweetXvSettingMockCopy.parents,
      sweetXvSettingMockCopy.godParents,
      sweetXvSettingMockCopy.firstSectionSentences,
      sweetXvSettingMockCopy.secondSectionSentences,
      sweetXvSettingMockCopy.massUrl,
      massTime,
      sweetXvSettingMockCopy.massAddress,
      sweetXvSettingMockCopy.receptionUrl,
      receptionTime,
      sweetXvSettingMockCopy.receptionPlace,
      sweetXvSettingMockCopy.receptionAddress,
      sweetXvSettingMockCopy.dressCodeColor
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
    settingsServiceSpy.updateEventSettings.and.returnValue(
      of(messageResponseMockCopy)
    );

    const dateOfReception = sweetXvSettingMockCopy.receptionTime.split(' ');

    const dateOfReceptionTime = dateOfReception[0];
    const timeOfReceptionTime = dateOfReception[1];
    const receptionTime = toLocalDate(
      `${dateOfReceptionTime}T${timeOfReceptionTime}.000Z`
    )
      .split('T')[1]
      .substring(0, 5);

    const dateOfMass = sweetXvSettingMockCopy.massTime.split(' ');
    const dateOfMassTime = dateOfMass[0];
    const timeOfMassTime = dateOfMass[1];
    const massTime = toLocalDate(`${dateOfMassTime}T${timeOfMassTime}.000Z`)
      .split('T')[1]
      .substring(0, 5);

    fixture.componentRef.setInput('eventSettingActionValue', {
      eventId: fullEventsMockCopy.id,
      eventType: EventType.SaveTheDate,
      isNew: false,
    });

    updateFormUsingEvent(
      sweetXvSettingMockCopy.primaryColor,
      sweetXvSettingMockCopy.secondaryColor,
      sweetXvSettingMockCopy.parents,
      sweetXvSettingMockCopy.godParents,
      sweetXvSettingMockCopy.firstSectionSentences,
      sweetXvSettingMockCopy.secondSectionSentences,
      sweetXvSettingMockCopy.massUrl,
      massTime,
      sweetXvSettingMockCopy.massAddress,
      sweetXvSettingMockCopy.receptionUrl,
      receptionTime,
      sweetXvSettingMockCopy.receptionPlace,
      sweetXvSettingMockCopy.receptionAddress,
      sweetXvSettingMockCopy.dressCodeColor
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
