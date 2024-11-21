import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { EventType } from 'src/app/core/models/enum';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SweetXvSettingsComponent } from 'src/app/dashboard/settings/sweet-xv-settings/sweet-xv-settings.component';
import {
  fullEventsMock,
  messageResponseMock,
  sweetXvBaseSettingMock,
  sweetXvSettingMock,
} from 'src/tests/mocks/mocks';

describe('Sweet Xv Settings (Integrated Test)', () => {
  let fixture: ComponentFixture<SweetXvSettingsComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  const updateFormUsingEvent = (
    eventId: string,
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
    fixture.componentInstance.createEventSettingsForm.patchValue({
      eventId,
    });
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

    TestBed.configureTestingModule({
      declarations: [SweetXvSettingsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: SettingsService, useValue: settingsSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    settingsServiceSpy = TestBed.inject(
      SettingsService
    ) as jasmine.SpyObj<SettingsService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SweetXvSettingsComponent);
    fixture.detectChanges();
  });

  it('should call getEventSettings() when parent component sends Input value', () => {
    settingsServiceSpy.getEventSettings.and.returnValue(
      of(sweetXvBaseSettingMock)
    );

    fixture.componentRef.setInput('eventSettingAction', {
      eventId: fullEventsMock.id,
      eventType: EventType.Xv,
      isNew: true,
    });

    expect(settingsServiceSpy.getEventSettings)
      .withContext(
        "getEventSettings method from SettingsService should've been called"
      )
      .toHaveBeenCalled();
  });

  it('should call createEventSettings when the event setting is new', () => {
    settingsServiceSpy.getEventSettings.and.returnValue(of());
    settingsServiceSpy.createEventSettings.and.returnValue(
      of(messageResponseMock)
    );

    fixture.componentRef.setInput('eventSettingAction', {
      eventId: fullEventsMock.id,
      eventType: EventType.SaveTheDate,
      isNew: true,
    });

    updateFormUsingEvent(
      sweetXvSettingMock.eventId,
      sweetXvSettingMock.primaryColor,
      sweetXvSettingMock.secondaryColor,
      sweetXvSettingMock.parents,
      sweetXvSettingMock.godParents,
      sweetXvSettingMock.firstSectionSentences,
      sweetXvSettingMock.secondSectionSentences,
      sweetXvSettingMock.massUrl,
      sweetXvSettingMock.massTime,
      sweetXvSettingMock.massAddress,
      sweetXvSettingMock.receptionUrl,
      sweetXvSettingMock.receptionTime,
      sweetXvSettingMock.receptionPlace,
      sweetXvSettingMock.receptionAddress,
      sweetXvSettingMock.dressCodeColor
    );

    fixture.componentInstance.sweetXvSettings.isNew = true;

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
    settingsServiceSpy.getEventSettings.and.returnValue(of());
    settingsServiceSpy.updateEventSettings.and.returnValue(
      of(messageResponseMock)
    );

    fixture.componentRef.setInput('eventSettingAction', {
      eventId: fullEventsMock.id,
      eventType: EventType.SaveTheDate,
      isNew: false,
    });
    updateFormUsingEvent(
      sweetXvSettingMock.eventId,
      sweetXvSettingMock.primaryColor,
      sweetXvSettingMock.secondaryColor,
      sweetXvSettingMock.parents,
      sweetXvSettingMock.godParents,
      sweetXvSettingMock.firstSectionSentences,
      sweetXvSettingMock.secondSectionSentences,
      sweetXvSettingMock.massUrl,
      sweetXvSettingMock.massTime,
      sweetXvSettingMock.massAddress,
      sweetXvSettingMock.receptionUrl,
      sweetXvSettingMock.receptionTime,
      sweetXvSettingMock.receptionPlace,
      sweetXvSettingMock.receptionAddress,
      sweetXvSettingMock.dressCodeColor
    );

    fixture.componentInstance.sweetXvSettings.isNew = false;

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
