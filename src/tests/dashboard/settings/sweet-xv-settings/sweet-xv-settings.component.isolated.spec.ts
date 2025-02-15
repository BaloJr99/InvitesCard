import { FormBuilder, Validators } from '@angular/forms';
import { SweetXvSettingsComponent } from 'src/app/dashboard/settings/sweet-xv-settings/sweet-xv-settings.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  showCeremonySection,
  showDressCodeSection,
  showGiftsSection,
  showReceptionSection,
  sweetXvSettingMock,
} from 'src/tests/mocks/mocks';

const showCeremonySectionCopy = deepCopy(showCeremonySection);
const showDressCodeSectionCopy = deepCopy(showDressCodeSection);
const showGiftsSectionCopy = deepCopy(showGiftsSection);
const showReceptionSectionCopy = deepCopy(showReceptionSection);
const sweetXvSettingMockCopy = deepCopy(sweetXvSettingMock);

describe('Sweet Xv Settings Component (Isolated Test)', () => {
  let component: SweetXvSettingsComponent;

  const updateForm = (
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
    component.createEventSettingsForm.controls['eventId'].setValue(eventId);
    component.createEventSettingsForm.controls['primaryColor'].setValue(
      primaryColor
    );
    component.createEventSettingsForm.controls['secondaryColor'].setValue(
      secondaryColor
    );
    component.createEventSettingsForm.controls[
      'firstSectionSentences'
    ].setValue(firstSectionSentences);
    component.createEventSettingsForm.controls['parents'].setValue(parents);
    component.createEventSettingsForm.controls['godParents'].setValue(
      godParents
    );
    component.createEventSettingsForm.controls[
      'secondSectionSentences'
    ].setValue(secondSectionSentences);
    component.createEventSettingsForm.controls['massUrl'].setValue(massUrl);
    component.createEventSettingsForm.controls['massTime'].setValue(massTime);
    component.createEventSettingsForm.controls['massAddress'].setValue(
      massAddress
    );
    component.createEventSettingsForm.controls['receptionUrl'].setValue(
      receptionUrl
    );
    component.createEventSettingsForm.controls['receptionTime'].setValue(
      receptionTime
    );
    component.createEventSettingsForm.controls['receptionPlace'].setValue(
      receptionPlace
    );
    component.createEventSettingsForm.controls['receptionAddress'].setValue(
      receptionAddress
    );
    component.createEventSettingsForm.controls['dressCodeColor'].setValue(
      dressCodeColor
    );
  };

  beforeEach(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', ['']);
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    component = new SweetXvSettingsComponent(
      eventsSpy,
      settingsSpy,
      new FormBuilder(),
      toastrSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.createEventSettingsForm)
      .withContext('The createEventSettingsForm should be defined')
      .toBeDefined();
    expect(component.sectionsControls)
      .withContext('The displayMessage should be an empty array')
      .toEqual({
        ceremonyInfo: {
          validators: {
            parents: ['', Validators.required],
            godParents: ['', Validators.required],
            secondSectionSentences: ['', Validators.required],
            massUrl: ['', Validators.required],
            massTime: ['', Validators.required],
            massAddress: ['', Validators.required],
          },
        },
        receptionInfo: {
          validators: {
            receptionUrl: ['', Validators.required],
            receptionTime: ['', Validators.required],
            receptionPlace: ['', Validators.required],
            receptionAddress: ['', Validators.required],
          },
        },
        dressCodeInfo: {
          validators: {
            dressCodeColor: ['', Validators.required],
          },
        },
      });
    expect(component.baseSections)
      .withContext('The baseSections should be defined')
      .toEqual([
        {
          sectionId: 'inviteInfo',
          name: 'Información de la invitación',
          disabled: true,
          selected: true,
          order: 0,
          draggable: false,
        },
        {
          sectionId: 'ceremonyInfo',
          name: 'Información de la ceremonia',
          disabled: false,
          selected: true,
          order: 1,
          draggable: true,
        },
        {
          sectionId: 'receptionInfo',
          name: 'Información de la recepción',
          disabled: false,
          selected: true,
          order: 2,
          draggable: true,
        },
        {
          sectionId: 'dressCodeInfo',
          name: 'Código de vestimenta',
          disabled: false,
          selected: true,
          order: 3,
          draggable: true,
        },
        {
          sectionId: 'giftsInfo',
          name: 'Regalos',
          disabled: false,
          selected: true,
          order: 4,
          draggable: true,
        },
        {
          sectionId: 'confirmationInfo',
          name: $localize`Formulario`,
          disabled: true,
          selected: true,
          order: 5,
          draggable: false,
        },
      ]);
  });

  it('form value should be invalid if one input is invalid', () => {
    component.updateSections(showGiftsSectionCopy);
    updateForm('', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
    expect(component.createEventSettingsForm.invalid)
      .withContext('Form should be invalid when fields are empty')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    component.updateSections(showGiftsSectionCopy);
    updateForm(
      sweetXvSettingMockCopy.eventId,
      sweetXvSettingMockCopy.primaryColor,
      sweetXvSettingMockCopy.secondaryColor,
      sweetXvSettingMockCopy.parents,
      sweetXvSettingMockCopy.godParents,
      sweetXvSettingMockCopy.firstSectionSentences,
      sweetXvSettingMockCopy.secondSectionSentences,
      sweetXvSettingMockCopy.massUrl,
      sweetXvSettingMockCopy.massTime,
      sweetXvSettingMockCopy.massAddress,
      sweetXvSettingMockCopy.receptionUrl,
      sweetXvSettingMockCopy.receptionTime,
      sweetXvSettingMockCopy.receptionPlace,
      sweetXvSettingMockCopy.receptionAddress,
      sweetXvSettingMockCopy.dressCodeColor
    );

    expect(component.createEventSettingsForm.valid)
      .withContext('Form should be valid')
      .toBeTrue();
  });

  it('should have the controls in the createEventSettingsForm', () => {
    const controls = component.createEventSettingsForm.controls;
    const eventId = controls['eventId'];
    const primaryColor = controls['primaryColor'];
    const secondaryColor = controls['secondaryColor'];
    const firstSectionSentences = controls['firstSectionSentences'];

    expect(eventId.valid).withContext('EventId should be invalid').toBeFalsy();
    expect(eventId.errors?.['required'])
      .withContext('EventId should be required')
      .toBeTruthy();

    expect(primaryColor.valid)
      .withContext('PrimaryColor should be invalid')
      .toBeFalsy();
    expect(primaryColor.errors?.['required'])
      .withContext('PrimaryColor should be required')
      .toBeTruthy();

    expect(secondaryColor.valid)
      .withContext('SecondaryColor should be invalid')
      .toBeFalsy();
    expect(secondaryColor.errors?.['required'])
      .withContext('SecondaryColor should be required')
      .toBeTruthy();

    expect(firstSectionSentences.valid)
      .withContext('FirstSectionSentences should be invalid')
      .toBeFalsy();
    expect(firstSectionSentences.errors?.['required'])
      .withContext('FirstSectionSentences should be required')
      .toBeTruthy();

    expect(Object.keys(controls).length)
      .withContext('The form should have 4 controls')
      .toBe(4);
  });

  it('should have the controls for the ceremony section in the createEventSettingsForm', () => {
    component.updateSections(showCeremonySectionCopy);
    const controls = component.createEventSettingsForm.controls;
    const eventId = controls['eventId'];
    const primaryColor = controls['primaryColor'];
    const secondaryColor = controls['secondaryColor'];
    const firstSectionSentences = controls['firstSectionSentences'];
    const parents = controls['parents'];
    const godParents = controls['godParents'];
    const secondSectionSentences = controls['secondSectionSentences'];
    const massUrl = controls['massUrl'];
    const massTime = controls['massTime'];
    const massAddress = controls['massAddress'];

    expect(eventId.valid).withContext('EventId should be invalid').toBeFalsy();
    expect(eventId.errors?.['required'])
      .withContext('EventId should be required')
      .toBeTruthy();

    expect(primaryColor.valid)
      .withContext('PrimaryColor should be invalid')
      .toBeFalsy();
    expect(primaryColor.errors?.['required'])
      .withContext('PrimaryColor should be required')
      .toBeTruthy();

    expect(secondaryColor.valid)
      .withContext('SecondaryColor should be invalid')
      .toBeFalsy();
    expect(secondaryColor.errors?.['required'])
      .withContext('SecondaryColor should be required')
      .toBeTruthy();

    expect(parents.valid).withContext('Parents should be invalid').toBeFalsy();
    expect(parents.errors?.['required'])
      .withContext('Parents should be required')
      .toBeTruthy();

    expect(godParents.valid)
      .withContext('GodParents should be invalid')
      .toBeFalsy();
    expect(godParents.errors?.['required'])
      .withContext('GodParents should be required')
      .toBeTruthy();

    expect(firstSectionSentences.valid)
      .withContext('FirstSectionSentences should be invalid')
      .toBeFalsy();
    expect(firstSectionSentences.errors?.['required'])
      .withContext('FirstSectionSentences should be required')
      .toBeTruthy();

    expect(secondSectionSentences.valid)
      .withContext('SecondSectionSentences should be invalid')
      .toBeFalsy();
    expect(secondSectionSentences.errors?.['required'])
      .withContext('SecondSectionSentences should be required')
      .toBeTruthy();

    expect(massUrl.valid).withContext('MassUrl should be invalid').toBeFalsy();
    expect(massUrl.errors?.['required'])
      .withContext('MassUrl should be required')
      .toBeTruthy();

    expect(massTime.valid)
      .withContext('MassTime should be invalid')
      .toBeFalsy();
    expect(massTime.errors?.['required'])
      .withContext('MassTime should be required')
      .toBeTruthy();

    expect(massAddress.valid)
      .withContext('MassAddress should be invalid')
      .toBeFalsy();
    expect(massAddress.errors?.['required'])
      .withContext('MassAddress should be required')
      .toBeTruthy();

    expect(Object.keys(controls).length)
      .withContext('The form should have 10 controls')
      .toBe(10);
  });

  it('should have the controls for the reception section in the createEventSettingsForm', () => {
    component.updateSections(showReceptionSectionCopy);
    const controls = component.createEventSettingsForm.controls;
    const eventId = controls['eventId'];
    const primaryColor = controls['primaryColor'];
    const secondaryColor = controls['secondaryColor'];
    const firstSectionSentences = controls['firstSectionSentences'];
    const parents = controls['parents'];
    const godParents = controls['godParents'];
    const secondSectionSentences = controls['secondSectionSentences'];
    const massUrl = controls['massUrl'];
    const massTime = controls['massTime'];
    const massAddress = controls['massAddress'];
    const receptionUrl = controls['receptionUrl'];
    const receptionTime = controls['receptionTime'];
    const receptionPlace = controls['receptionPlace'];
    const receptionAddress = controls['receptionAddress'];

    expect(eventId.valid).withContext('EventId should be invalid').toBeFalsy();
    expect(eventId.errors?.['required'])
      .withContext('EventId should be required')
      .toBeTruthy();

    expect(primaryColor.valid)
      .withContext('PrimaryColor should be invalid')
      .toBeFalsy();
    expect(primaryColor.errors?.['required'])
      .withContext('PrimaryColor should be required')
      .toBeTruthy();

    expect(secondaryColor.valid)
      .withContext('SecondaryColor should be invalid')
      .toBeFalsy();
    expect(secondaryColor.errors?.['required'])
      .withContext('SecondaryColor should be required')
      .toBeTruthy();

    expect(parents.valid).withContext('Parents should be invalid').toBeFalsy();
    expect(parents.errors?.['required'])
      .withContext('Parents should be required')
      .toBeTruthy();

    expect(godParents.valid)
      .withContext('GodParents should be invalid')
      .toBeFalsy();
    expect(godParents.errors?.['required'])
      .withContext('GodParents should be required')
      .toBeTruthy();

    expect(firstSectionSentences.valid)
      .withContext('FirstSectionSentences should be invalid')
      .toBeFalsy();
    expect(firstSectionSentences.errors?.['required'])
      .withContext('FirstSectionSentences should be required')
      .toBeTruthy();

    expect(secondSectionSentences.valid)
      .withContext('SecondSectionSentences should be invalid')
      .toBeFalsy();
    expect(secondSectionSentences.errors?.['required'])
      .withContext('SecondSectionSentences should be required')
      .toBeTruthy();

    expect(massUrl.valid).withContext('MassUrl should be invalid').toBeFalsy();
    expect(massUrl.errors?.['required'])
      .withContext('MassUrl should be required')
      .toBeTruthy();

    expect(massTime.valid)
      .withContext('MassTime should be invalid')
      .toBeFalsy();
    expect(massTime.errors?.['required'])
      .withContext('MassTime should be required')
      .toBeTruthy();

    expect(massAddress.valid)
      .withContext('MassAddress should be invalid')
      .toBeFalsy();
    expect(massAddress.errors?.['required'])
      .withContext('MassAddress should be required')
      .toBeTruthy();

    expect(receptionUrl.valid)
      .withContext('ReceptionUrl should be invalid')
      .toBeFalsy();
    expect(receptionUrl.errors?.['required'])
      .withContext('ReceptionUrl should be required')
      .toBeTruthy();

    expect(receptionTime.valid)
      .withContext('ReceptionTime should be invalid')
      .toBeFalsy();
    expect(receptionTime.errors?.['required'])
      .withContext('ReceptionTime should be required')
      .toBeTruthy();

    expect(receptionPlace.valid)
      .withContext('ReceptionPlace should be invalid')
      .toBeFalsy();
    expect(receptionPlace.errors?.['required'])
      .withContext('ReceptionPlace should be required')
      .toBeTruthy();

    expect(receptionAddress.valid)
      .withContext('ReceptionAddress should be invalid')
      .toBeFalsy();
    expect(receptionAddress.errors?.['required'])
      .withContext('ReceptionAddress should be required')
      .toBeTruthy();

    expect(Object.keys(controls).length)
      .withContext('The form should have 14 controls')
      .toBe(14);
  });

  it('should have the controls for the dressCode section in the createEventSettingsForm', () => {
    component.updateSections(showDressCodeSectionCopy);
    const controls = component.createEventSettingsForm.controls;
    const eventId = controls['eventId'];
    const primaryColor = controls['primaryColor'];
    const secondaryColor = controls['secondaryColor'];
    const firstSectionSentences = controls['firstSectionSentences'];
    const parents = controls['parents'];
    const godParents = controls['godParents'];
    const secondSectionSentences = controls['secondSectionSentences'];
    const massUrl = controls['massUrl'];
    const massTime = controls['massTime'];
    const massAddress = controls['massAddress'];
    const receptionUrl = controls['receptionUrl'];
    const receptionTime = controls['receptionTime'];
    const receptionPlace = controls['receptionPlace'];
    const receptionAddress = controls['receptionAddress'];
    const dressCodeColor = controls['dressCodeColor'];

    expect(eventId.valid).withContext('EventId should be invalid').toBeFalsy();
    expect(eventId.errors?.['required'])
      .withContext('EventId should be required')
      .toBeTruthy();

    expect(primaryColor.valid)
      .withContext('PrimaryColor should be invalid')
      .toBeFalsy();
    expect(primaryColor.errors?.['required'])
      .withContext('PrimaryColor should be required')
      .toBeTruthy();

    expect(secondaryColor.valid)
      .withContext('SecondaryColor should be invalid')
      .toBeFalsy();
    expect(secondaryColor.errors?.['required'])
      .withContext('SecondaryColor should be required')
      .toBeTruthy();

    expect(parents.valid).withContext('Parents should be invalid').toBeFalsy();
    expect(parents.errors?.['required'])
      .withContext('Parents should be required')
      .toBeTruthy();

    expect(godParents.valid)
      .withContext('GodParents should be invalid')
      .toBeFalsy();
    expect(godParents.errors?.['required'])
      .withContext('GodParents should be required')
      .toBeTruthy();

    expect(firstSectionSentences.valid)
      .withContext('FirstSectionSentences should be invalid')
      .toBeFalsy();
    expect(firstSectionSentences.errors?.['required'])
      .withContext('FirstSectionSentences should be required')
      .toBeTruthy();

    expect(secondSectionSentences.valid)
      .withContext('SecondSectionSentences should be invalid')
      .toBeFalsy();
    expect(secondSectionSentences.errors?.['required'])
      .withContext('SecondSectionSentences should be required')
      .toBeTruthy();

    expect(massUrl.valid).withContext('MassUrl should be invalid').toBeFalsy();
    expect(massUrl.errors?.['required'])
      .withContext('MassUrl should be required')
      .toBeTruthy();

    expect(massTime.valid)
      .withContext('MassTime should be invalid')
      .toBeFalsy();
    expect(massTime.errors?.['required'])
      .withContext('MassTime should be required')
      .toBeTruthy();

    expect(massAddress.valid)
      .withContext('MassAddress should be invalid')
      .toBeFalsy();
    expect(massAddress.errors?.['required'])
      .withContext('MassAddress should be required')
      .toBeTruthy();

    expect(receptionUrl.valid)
      .withContext('ReceptionUrl should be invalid')
      .toBeFalsy();
    expect(receptionUrl.errors?.['required'])
      .withContext('ReceptionUrl should be required')
      .toBeTruthy();

    expect(receptionTime.valid)
      .withContext('ReceptionTime should be invalid')
      .toBeFalsy();
    expect(receptionTime.errors?.['required'])
      .withContext('ReceptionTime should be required')
      .toBeTruthy();

    expect(receptionPlace.valid)
      .withContext('ReceptionPlace should be invalid')
      .toBeFalsy();
    expect(receptionPlace.errors?.['required'])
      .withContext('ReceptionPlace should be required')
      .toBeTruthy();

    expect(receptionAddress.valid)
      .withContext('ReceptionAddress should be invalid')
      .toBeFalsy();
    expect(receptionAddress.errors?.['required'])
      .withContext('ReceptionAddress should be required')
      .toBeTruthy();

    expect(dressCodeColor.valid)
      .withContext('DressCodeColor should be invalid')
      .toBeFalsy();
    expect(dressCodeColor.errors?.['required'])
      .withContext('DressCodeColor should be required')
      .toBeTruthy();
  });
});
