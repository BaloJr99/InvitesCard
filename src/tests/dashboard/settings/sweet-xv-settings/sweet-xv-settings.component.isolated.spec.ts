import { FormBuilder } from '@angular/forms';
import { ISettingAction } from 'src/app/core/models/settings';
import { SweetXvSettingsComponent } from 'src/app/dashboard/settings/sweet-xv-settings/sweet-xv-settings.component';
import { sweetXvSettingMock } from 'src/tests/mocks/mocks';

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
    component.createEventSettingsForm.controls['parents'].setValue(parents);
    component.createEventSettingsForm.controls['godParents'].setValue(
      godParents
    );
    component.createEventSettingsForm.controls[
      'firstSectionSentences'
    ].setValue(firstSectionSentences);
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
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    component = new SweetXvSettingsComponent(
      loaderSpy,
      settingsSpy,
      new FormBuilder(),
      toastrSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.sweetXvSettings)
      .withContext('The eventSettings should be an empty object')
      .toEqual({} as ISettingAction);
    expect(component.createEventSettingsForm)
      .withContext('The createEventSettingsForm should be defined')
      .toBeDefined();
    expect(component.displayMessage)
      .withContext('The displayMessage should be an empty array')
      .toEqual({});
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
    expect(component.createEventSettingsForm.invalid)
      .withContext('Form should be invalid when fields are empty')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(
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

    expect(component.createEventSettingsForm.valid)
      .withContext('Form should be valid')
      .toBeTrue();
  });

  it('should have eventId, primaryColor, secondaryColor, receptionPlace, copyMessage, hotelName, hotelInformation in the createEventSettingsForm', () => {
    const controls = component.createEventSettingsForm.controls;
    const eventId = controls['eventId'];
    const primaryColor = controls['primaryColor'];
    const secondaryColor = controls['secondaryColor'];
    const parents = controls['parents'];
    const godParents = controls['godParents'];
    const firstSectionSentences = controls['firstSectionSentences'];
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
