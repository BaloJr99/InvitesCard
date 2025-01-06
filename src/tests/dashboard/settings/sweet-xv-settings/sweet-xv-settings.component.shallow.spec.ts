import { NO_ERRORS_SCHEMA } from '@angular/core';
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
  sweetXvBaseSettingMock,
  sweetXvSettingMock,
} from 'src/tests/mocks/mocks';

describe('Sweet Xv Settings Component (Shallow test)', () => {
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

  const clickSection = (section: string, show: boolean) => {
    const sectionElement = fixture.debugElement.query(By.css(`#input-${section}`));
    if (show && !sectionElement.nativeElement.checked) {
      sectionElement.nativeElement.click();
      fixture.detectChanges();
    }

    if (!show && sectionElement.nativeElement.checked) {
      sectionElement.nativeElement.click();
      fixture.detectChanges();
    }
  };

  beforeEach(waitForAsync(() => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', [
      'getEventSettings',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [SweetXvSettingsComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
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
    settingsServiceSpy.getEventSettings.and.returnValue(
      of(sweetXvBaseSettingMock)
    );
    fixture = TestBed.createComponent(SweetXvSettingsComponent);
    fixture.componentRef.setInput('eventSettingAction', {
      eventId: fullEventsMock.id,
      eventType: EventType.Xv,
      isNew: true,
    });
    fixture.detectChanges();
  });

  it('created a form with all the sections inputs, save button, cancel button', () => {
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

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[0];
    const cancelButton = buttons[1];

    // Info section shouldn't be null
    expect(primaryColorInput)
      .withContext("PrimaryColorInput input shouln't be null")
      .not.toBeNull();
    expect(secondaryColorInput)
      .withContext("SecondaryColorInput input shouln't be null")
      .not.toBeNull();
    expect(firstSectionSentencesInput)
      .withContext("FirstSectionSentencesInput input shouln't be null")
      .not.toBeNull();

    // Ceremony section shouldn't be null
    expect(parentsInput)
      .withContext("ParentsInput input shouln't be null")
      .not.toBeNull();
    expect(godParentsInput)
      .withContext("GodParentsInput input shouln't be null")
      .not.toBeNull();
    expect(secondSectionSentencesInput)
      .withContext("SecondSectionSentencesInput input shouln't be null")
      .not.toBeNull();
    expect(massUrlInput)
      .withContext("MassUrlInput input shouln't be null")
      .not.toBeNull();
    expect(massTimeInput)
      .withContext("MassTimeInput input shouln't be null")
      .not.toBeNull();
    expect(massAddressInput)
      .withContext("MassAddressInput input shouln't be null")
      .not.toBeNull();

    // Reception section shouldn't be null
    expect(receptionPlaceInput)
      .withContext('ReceptionPlaceInput input should be null')
      .not.toBeNull();
    expect(receptionUrlInput)
      .withContext("ReceptionUrlInput input shouln't be null")
      .not.toBeNull();
    expect(receptionTimeInput)
      .withContext("ReceptionTimeInput input shouln't be null")
      .not.toBeNull();
    expect(receptionAddressInput)
      .withContext("ReceptionAddressInput input shouln't be null")
      .not.toBeNull();

    // Gifts section shouldn't be null
    expect(dressCodeColorInput)
      .withContext("DressCodeColorInput input shouln't be null")
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

    const controls = fixture.componentInstance.createEventSettingsForm.controls;

    expect(controls['eventId'].value)
      .withContext('eventId control should be filled when input changes')
      .toBe(sweetXvSettingMock.eventId);
    expect(controls['primaryColor'].value)
      .withContext('primaryColor control should be filled when input changes')
      .toBe(sweetXvSettingMock.primaryColor);
    expect(controls['secondaryColor'].value)
      .withContext('secondaryColor control should be filled when input changes')
      .toBe(sweetXvSettingMock.secondaryColor);
    expect(controls['parents'].value)
      .withContext('parents control should be filled when input changes')
      .toBe(sweetXvSettingMock.parents);
    expect(controls['godParents'].value)
      .withContext('godParents control should be filled when input changes')
      .toBe(sweetXvSettingMock.godParents);
    expect(controls['firstSectionSentences'].value)
      .withContext(
        'firstSectionSentences control should be filled when input changes'
      )
      .toBe(sweetXvSettingMock.firstSectionSentences);
    expect(controls['secondSectionSentences'].value)
      .withContext(
        'secondSectionSentences control should be filled when input changes'
      )
      .toBe(sweetXvSettingMock.secondSectionSentences);
    expect(controls['massUrl'].value)
      .withContext('massUrl control should be filled when input changes')
      .toBe(sweetXvSettingMock.massUrl);
    expect(controls['massTime'].value)
      .withContext('massTime control should be filled when input changes')
      .toBe(sweetXvSettingMock.massTime);
    expect(controls['massAddress'].value)
      .withContext('massAddress control should be filled when input changes')
      .toBe(sweetXvSettingMock.massAddress);
    expect(controls['receptionUrl'].value)
      .withContext('receptionUrl control should be filled when input changes')
      .toBe(sweetXvSettingMock.receptionUrl);
    expect(controls['receptionTime'].value)
      .withContext('receptionTime control should be filled when input changes')
      .toBe(sweetXvSettingMock.receptionTime);
    expect(controls['receptionPlace'].value)
      .withContext('receptionPlace control should be filled when input changes')
      .toBe(sweetXvSettingMock.receptionPlace);
    expect(controls['receptionAddress'].value)
      .withContext(
        'receptionAddress control should be filled when input changes'
      )
      .toBe(sweetXvSettingMock.receptionAddress);
    expect(controls['dressCodeColor'].value)
      .withContext('dressCodeColor control should be filled when input changes')
      .toBe(sweetXvSettingMock.dressCodeColor);
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

  it(`Shouldn't be able to save if fields are not filled`, () => {
    updateFormUsingEvent(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    );

    const saveButton = fixture.debugElement.queryAll(By.css('button'))[1];

    expect(saveButton.nativeElement.disabled)
      .withContext('Save button should be disabled')
      .toBeTrue();
  });

  it('Should be able to save when fields are filled', () => {
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

    const saveButton = fixture.debugElement.queryAll(By.css('button'))[1];

    expect(saveButton.nativeElement.disabled)
      .withContext('Save button should be enabled')
      .toBeFalse();
  });

  it('should hide the sections that are not selected', () => {
    expect(fixture.debugElement.query(By.css('.ceremony')))
      .withContext('Ceremony section should be visible')
      .not.toBeNull();
    expect(fixture.debugElement.query(By.css('.reception')))
      .withContext('Reception section should be visible')
      .not.toBeNull();
    expect(fixture.debugElement.query(By.css('.dressCode')))
      .withContext('DressCode section should be visible')
      .not.toBeNull();
    clickSection('ceremonyInfo', false);
    expect(fixture.debugElement.query(By.css('.ceremony')))
      .withContext('Ceremony section should be hidden')
      .toBeNull();
    clickSection('receptionInfo', false);
    expect(fixture.debugElement.query(By.css('.reception')))
      .withContext('Reception section should be hidden')
      .toBeNull();
    clickSection('dressCodeInfo', false);
    expect(fixture.debugElement.query(By.css('.dressCode')))
      .withContext('DressCode section should be hidden')
      .toBeNull();
  });
});
