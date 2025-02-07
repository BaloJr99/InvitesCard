import { FormBuilder } from '@angular/forms';
import { ISettingAction } from 'src/app/core/models/settings';
import { SaveTheDateSettingsComponent } from 'src/app/dashboard/settings/save-the-date-settings/save-the-date-settings.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { saveTheDateSettingMock } from 'src/tests/mocks/mocks';

const saveTheDateSettingMockCopy = deepCopy(saveTheDateSettingMock);

describe('Save The Date Settings Component (Isolated Test)', () => {
  let component: SaveTheDateSettingsComponent;

  const updateForm = (
    eventId: string,
    primaryColor: string,
    secondaryColor: string,
    receptionPlace: string,
    copyMessage: string,
    hotelName: string,
    hotelInformation: string
  ) => {
    component.createEventSettingsForm.controls['eventId'].setValue(eventId);
    component.createEventSettingsForm.controls['primaryColor'].setValue(
      primaryColor
    );
    component.createEventSettingsForm.controls['secondaryColor'].setValue(
      secondaryColor
    );
    component.createEventSettingsForm.controls['receptionPlace'].setValue(
      receptionPlace
    );
    component.createEventSettingsForm.controls['copyMessage'].setValue(
      copyMessage
    );
    component.createEventSettingsForm.controls['hotelName'].setValue(hotelName);
    component.createEventSettingsForm.controls['hotelInformation'].setValue(
      hotelInformation
    );
  };

  beforeEach(() => {
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    component = new SaveTheDateSettingsComponent(
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
    expect(component.saveTheDateSettings)
      .withContext('The eventSettings should be an empty object')
      .toEqual({} as ISettingAction);
    expect(component.createEventSettingsForm)
      .withContext('The createEventSettingsForm should be defined')
      .toBeDefined();
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', '', '', '', '', '', '');
    expect(component.createEventSettingsForm.invalid)
      .withContext('Form should be invalid when fields are empty')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(
      saveTheDateSettingMockCopy.eventId,
      saveTheDateSettingMockCopy.primaryColor,
      saveTheDateSettingMockCopy.secondaryColor,
      saveTheDateSettingMockCopy.receptionPlace,
      saveTheDateSettingMockCopy.copyMessage,
      saveTheDateSettingMockCopy.hotelName,
      saveTheDateSettingMockCopy.hotelInformation
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
    const receptionPlace = controls['receptionPlace'];
    const copyMessage = controls['copyMessage'];
    const hotelName = controls['hotelName'];
    const hotelInformation = controls['hotelInformation'];

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

    expect(receptionPlace.valid)
      .withContext('ReceptionPlace should be invalid')
      .toBeFalsy();
    expect(receptionPlace.errors?.['required'])
      .withContext('ReceptionPlace should be required')
      .toBeTruthy();

    expect(copyMessage.valid)
      .withContext('CopyMessage should be invalid')
      .toBeFalsy();
    expect(copyMessage.errors?.['required'])
      .withContext('CopyMessage should be required')
      .toBeTruthy();

    expect(hotelName.valid)
      .withContext('HotelName should be invalid')
      .toBeFalsy();
    expect(hotelName.errors?.['required'])
      .withContext('HotelName should be required')
      .toBeTruthy();

    expect(hotelInformation.valid)
      .withContext('HotelInformation should be invalid')
      .toBeFalsy();
    expect(hotelInformation.errors?.['required'])
      .withContext('HotelInformation should be required')
      .toBeTruthy();
  });
});
