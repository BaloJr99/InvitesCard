import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SweetXvSettingsComponent } from 'src/app/dashboard/settings/sweet-xv-settings/sweet-xv-settings.component';
import { sweetXvSettingMock } from 'src/tests/mocks/mocks';

describe('Sweet Xv Settings Component (Shallow test)', () => {
  let fixture: ComponentFixture<SweetXvSettingsComponent>;

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
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SweetXvSettingsComponent);
    fixture.detectChanges();
  });

  it('created a form with all the inputs, save button, cancel button', () => {
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

    expect(primaryColorInput)
      .withContext("PrimaryColorInput input shouln't be null")
      .not.toBeNull();
    expect(secondaryColorInput)
      .withContext("SecondaryColorInput input shouln't be null")
      .not.toBeNull();
    expect(receptionPlaceInput)
      .withContext("ReceptionPlaceInput input shouln't be null")
      .not.toBeNull();
    expect(parentsInput)
      .withContext("ParentsInput input shouln't be null")
      .not.toBeNull();
    expect(godParentsInput)
      .withContext("GodParentsInput input shouln't be null")
      .not.toBeNull();
    expect(firstSectionSentencesInput)
      .withContext("FirstSectionSentencesInput input shouln't be null")
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
    expect(receptionUrlInput)
      .withContext("ReceptionUrlInput input shouln't be null")
      .not.toBeNull();
    expect(receptionTimeInput)
      .withContext("ReceptionTimeInput input shouln't be null")
      .not.toBeNull();
    expect(receptionAddressInput)
      .withContext("ReceptionAddressInput input shouln't be null")
      .not.toBeNull();
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

  it('Display error message when fields are blank', () => {
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

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const primaryColorErrorSpan = errorSpans[0];
    const secondaryColorErrorSpan = errorSpans[1];
    const parentsErrorSpan = errorSpans[2];
    const godParentsErrorSpan = errorSpans[3];
    const firstSectionSentencesErrorSpan = errorSpans[4];
    const secondSectionSentencesErrorSpan = errorSpans[5];
    const massUrlErrorSpan = errorSpans[6];
    const massTimeErrorSpan = errorSpans[7];
    const massAddressErrorSpan = errorSpans[8];
    const receptionUrlErrorSpan = errorSpans[9];
    const receptionTimeErrorSpan = errorSpans[10];
    const receptionPlaceErrorSpan = errorSpans[11];
    const receptionAddressErrorSpan = errorSpans[12];
    const dressCodeColorErrorSpan = errorSpans[13];

    expect(primaryColorErrorSpan.nativeElement.innerHTML.trim())
      .withContext('primaryColor span error should be filled')
      .toBe('');
    expect(secondaryColorErrorSpan.nativeElement.innerHTML.trim())
      .withContext('secondaryColor span error should be filled')
      .toBe('');
    expect(parentsErrorSpan.nativeElement.innerHTML)
      .withContext('parents span error should be filled')
      .toContain('Ingresar nombre de los padres');
    expect(godParentsErrorSpan.nativeElement.innerHTML)
      .withContext('godParents span error should be filled')
      .toContain('Ingresar nombre de los padrinos');
    expect(firstSectionSentencesErrorSpan.nativeElement.innerHTML)
      .withContext('firstSectionSentences span error should be filled')
      .toContain('Ingresar datos de la primer sección');
    expect(secondSectionSentencesErrorSpan.nativeElement.innerHTML)
      .withContext('secondSectionSentences span error should be filled')
      .toContain('Ingresar datos de la segunda sección');
    expect(massUrlErrorSpan.nativeElement.innerHTML)
      .withContext('massUrl span error should be filled')
      .toContain('Ingresar url de la ubicación de la misa');
    expect(massTimeErrorSpan.nativeElement.innerHTML)
      .withContext('massTime span error should be filled')
      .toContain('Ingresar hora de la misa');
    expect(massAddressErrorSpan.nativeElement.innerHTML)
      .withContext('massAddress span error should be filled')
      .toContain('Ingresar dirección de la misa');
    expect(receptionUrlErrorSpan.nativeElement.innerHTML)
      .withContext('receptionUrl span error should be filled')
      .toContain('Ingresar url de la ubicación de recepción');
    expect(receptionTimeErrorSpan.nativeElement.innerHTML)
      .withContext('receptionTime span error should be filled')
      .toContain('Ingresar hora de la recepción');
    expect(receptionPlaceErrorSpan.nativeElement.innerHTML)
      .withContext('receptionPlace span error should be filled')
      .toContain('Ingresar nombre de salón de eventos');
    expect(receptionAddressErrorSpan.nativeElement.innerHTML)
      .withContext('receptionAddress span error should be filled')
      .toContain('Ingresar dirección de recepción');
    expect(dressCodeColorErrorSpan.nativeElement.innerHTML)
      .withContext('dressCodeColor span error should be filled')
      .toContain('Ingresar si existe restricción de color');

    const displayMessages = fixture.componentInstance.displayMessage;

    expect(displayMessages['primaryColor'])
      .withContext('primaryColor displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['secondaryColor'])
      .withContext('secondaryColor displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['parents'])
      .withContext('parents displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['godParents'])
      .withContext('godParents displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['firstSectionSentences'])
      .withContext('firstSectionSentences displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['secondSectionSentences'])
      .withContext('secondSectionSentences displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['massUrl'])
      .withContext('massUrl displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['massTime'])
      .withContext('massTime displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['massAddress'])
      .withContext('massAddress displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['receptionUrl'])
      .withContext('receptionUrl displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['receptionTime'])
      .withContext('receptionTime displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['receptionPlace'])
      .withContext('receptionPlace displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['receptionAddress'])
      .withContext('receptionAddress displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['dressCodeColor'])
      .withContext('dressCodeColor displayMessage should exist')
      .toBeDefined();

    expect(displayMessages['primaryColor'])
      .withContext('Should displayMessage error for primaryColor')
      .toBe('');
    expect(displayMessages['secondaryColor'])
      .withContext('Should displayMessage error for secondaryColor')
      .toBe('');
    expect(displayMessages['parents'])
      .withContext('Should displayMessage error for parents')
      .toContain('Ingresar nombre de los padres');
    expect(displayMessages['godParents'])
      .withContext('Should displayMessage error for godParents')
      .toContain('Ingresar nombre de los padrinos');
    expect(displayMessages['firstSectionSentences'])
      .withContext('Should displayMessage error for firstSectionSentences')
      .toContain('Ingresar datos de la primer sección');
    expect(displayMessages['secondSectionSentences'])
      .withContext('Should displayMessage error for secondSectionSentences')
      .toContain('Ingresar datos de la segunda sección');
    expect(displayMessages['massUrl'])
      .withContext('Should displayMessage error for massUrl')
      .toContain('Ingresar url de la ubicación de la misa');
    expect(displayMessages['massTime'])
      .withContext('Should displayMessage error for massTime')
      .toContain('Ingresar hora de la misa');
    expect(displayMessages['massAddress'])
      .withContext('Should displayMessage error for massAddress')
      .toContain('Ingresar dirección de la misa');
    expect(displayMessages['receptionUrl'])
      .withContext('Should displayMessage error for receptionUrl')
      .toContain('Ingresar url de la ubicación de recepción');
    expect(displayMessages['receptionTime'])
      .withContext('Should displayMessage error for receptionTime')
      .toContain('Ingresar hora de la recepción');
    expect(displayMessages['receptionPlace'])
      .withContext('Should displayMessage error for receptionPlace')
      .toContain('Ingresar nombre de salón de eventos');
    expect(displayMessages['receptionAddress'])
      .withContext('Should displayMessage error for receptionAddress')
      .toContain('Ingresar dirección de recepción');
    expect(displayMessages['dressCodeColor'])
      .withContext('Should displayMessage error for dressCodeColor')
      .toContain('Ingresar si existe restricción de color');
  });

  it("Shouldn't display primaryColor, secondaryColor, receptionPlace, copyMessage, hotelName, hotelInformation error message when fields are filled", () => {
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

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const primaryColorErrorSpan = errorSpans[0];
    const secondaryColorErrorSpan = errorSpans[1];
    const parentsErrorSpan = errorSpans[2];
    const godParentsErrorSpan = errorSpans[3];
    const firstSectionSentencesErrorSpan = errorSpans[4];
    const secondSectionSentencesErrorSpan = errorSpans[5];
    const massUrlErrorSpan = errorSpans[6];
    const massTimeErrorSpan = errorSpans[7];
    const massAddressErrorSpan = errorSpans[8];
    const receptionUrlErrorSpan = errorSpans[9];
    const receptionTimeErrorSpan = errorSpans[10];
    const receptionPlaceErrorSpan = errorSpans[11];
    const receptionAddressErrorSpan = errorSpans[12];
    const dressCodeColorErrorSpan = errorSpans[13];

    expect(primaryColorErrorSpan.nativeElement.innerHTML.trim())
      .withContext("primaryColor span error shouldn't be filled")
      .toBe('');
    expect(secondaryColorErrorSpan.nativeElement.innerHTML.trim())
      .withContext("secondaryColor span error shouldn't be filled")
      .toBe('');
    expect(parentsErrorSpan.nativeElement.innerHTML)
      .withContext("parents span error shouldn't be filled")
      .not.toContain('Ingresar nombre de los padres');
    expect(godParentsErrorSpan.nativeElement.innerHTML)
      .withContext("godParents span error shouldn't be filled")
      .not.toContain('Ingresar nombre de los padrinos');
    expect(firstSectionSentencesErrorSpan.nativeElement.innerHTML)
      .withContext("firstSectionSentences span error shouldn't be filled")
      .not.toContain('Ingresar datos de la primer sección');
    expect(secondSectionSentencesErrorSpan.nativeElement.innerHTML)
      .withContext("secondSectionSentences span error shouldn't be filled")
      .not.toContain('Ingresar datos de la segunda sección');
    expect(massUrlErrorSpan.nativeElement.innerHTML)
      .withContext("massUrl span error shouldn't be filled")
      .not.toContain('Ingresar url de la ubicación de la misa');
    expect(massTimeErrorSpan.nativeElement.innerHTML)
      .withContext("massTime span error shouldn't be filled")
      .not.toContain('Ingresar hora de la misa');
    expect(massAddressErrorSpan.nativeElement.innerHTML)
      .withContext("massAddress span error shouldn't be filled")
      .not.toContain('Ingresar dirección de la misa');
    expect(receptionUrlErrorSpan.nativeElement.innerHTML)
      .withContext("receptionUrl span error shouldn't be filled")
      .not.toContain('Ingresar url de la ubicación de recepción');
    expect(receptionTimeErrorSpan.nativeElement.innerHTML)
      .withContext("receptionTime span error shouldn't be filled")
      .not.toContain('Ingresar hora de la recepción');
    expect(receptionPlaceErrorSpan.nativeElement.innerHTML)
      .withContext("receptionPlace span error shouldn't be filled")
      .not.toContain('Ingresar nombre de salón de eventos');
    expect(receptionAddressErrorSpan.nativeElement.innerHTML)
      .withContext("receptionAddress span error shouldn't be filled")
      .not.toContain('Ingresar dirección de recepción');
    expect(dressCodeColorErrorSpan.nativeElement.innerHTML)
      .withContext("dressCodeColor span error shouldn't be filled")
      .not.toContain('Ingresar si existe restricción de color');

    const displayMessages = fixture.componentInstance.displayMessage;

    expect(displayMessages['primaryColor'])
      .withContext('primaryColor displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['secondaryColor'])
      .withContext('secondaryColor displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['parents'])
      .withContext('parents displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['godParents'])
      .withContext('godParents displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['firstSectionSentences'])
      .withContext('firstSectionSentences displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['secondSectionSentences'])
      .withContext('secondSectionSentences displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['massUrl'])
      .withContext('massUrl displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['massTime'])
      .withContext('massTime displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['massAddress'])
      .withContext('massAddress displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['receptionUrl'])
      .withContext('receptionUrl displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['receptionTime'])
      .withContext('receptionTime displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['receptionPlace'])
      .withContext('receptionPlace displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['receptionAddress'])
      .withContext('receptionAddress displayMessage should exist')
      .toBeDefined();
    expect(displayMessages['dressCodeColor'])
      .withContext('dressCodeColor displayMessage should exist')
      .toBeDefined();

    expect(displayMessages['primaryColor'])
      .withContext("Shouldn't displayMessage error for primaryColor")
      .toBe('');
    expect(displayMessages['secondaryColor'])
      .withContext("Shouldn't displayMessage error for secondaryColor")
      .toBe('');
    expect(displayMessages['parents'])
      .withContext("Shouldn't displayMessage error for parents")
      .not.toBe('Ingresar nombre de los padres');
    expect(displayMessages['godParents'])
      .withContext("Shouldn't displayMessage error for godParents")
      .not.toBe('Ingresar nombre de los padrinos');
    expect(displayMessages['firstSectionSentences'])
      .withContext("Shouldn't displayMessage error for firstSectionSentences")
      .not.toBe('Ingresar datos de la primer sección');
    expect(displayMessages['secondSectionSentences'])
      .withContext("Shouldn't displayMessage error for secondSectionSentences")
      .not.toBe('Ingresar datos de la segunda sección');
    expect(displayMessages['massUrl'])
      .withContext("Shouldn't displayMessage error for massUrl")
      .not.toBe('Ingresar url de la ubicación de la misa');
    expect(displayMessages['massTime'])
      .withContext("Shouldn't displayMessage error for massTime")
      .not.toBe('Ingresar hora de la misa');
    expect(displayMessages['massAddress'])
      .withContext("Shouldn't displayMessage error for massAddress")
      .not.toBe('Ingresar dirección de la misa');
    expect(displayMessages['receptionUrl'])
      .withContext("Shouldn't displayMessage error for receptionUrl")
      .not.toBe('Ingresar url de la ubicación de recepción');
    expect(displayMessages['receptionTime'])
      .withContext("Shouldn't displayMessage error for receptionTime")
      .not.toBe('Ingresar hora de la recepción');
    expect(displayMessages['receptionPlace'])
      .withContext("Shouldn't displayMessage error for receptionPlace")
      .not.toBe('Ingresar nombre de salón de eventos');
    expect(displayMessages['receptionAddress'])
      .withContext("Shouldn't displayMessage error for receptionAddress")
      .not.toBe('Ingresar dirección de recepción');
    expect(displayMessages['dressCodeColor'])
      .withContext("Shouldn't displayMessage error for dressCodeColor")
      .not.toBe('Ingresar si existe restricción de color');
  });
});
