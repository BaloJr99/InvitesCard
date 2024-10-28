import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SettingsService } from 'src/app/core/services/settings.service';
import {
  baseSettingMock,
  fullEventsMock,
  messageResponseMock,
  saveTheDateSetting,
  sweetXvSetting,
} from 'src/tests/mocks/mocks';

describe('Settings Service', () => {
  let settingsService: SettingsService;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SettingsService', [
      'getEventSettings',
      'createEventSettings',
      'updateEventSettings',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: SettingsService, useValue: spy }],
    });

    settingsServiceSpy = TestBed.inject(
      SettingsService
    ) as jasmine.SpyObj<SettingsService>;
  });

  it('should be created', () => {
    settingsService = TestBed.inject(SettingsService);
    expect(settingsService)
      .withContext('Expected Settings Service to have been created')
      .toBeTruthy();
  });

  it('should call getEventSettings', () => {
    settingsServiceSpy.getEventSettings.and.returnValue(of(baseSettingMock));

    settingsServiceSpy
      .getEventSettings(fullEventsMock.id)
      .subscribe((response) => {
        expect(response).toEqual(baseSettingMock);
        expect(response.eventId).toEqual(fullEventsMock.id);
      });

    expect(settingsServiceSpy.getEventSettings)
      .withContext('Expected getEventSettings to have been called')
      .toHaveBeenCalledOnceWith(fullEventsMock.id);
  });

  it('should call createEventSettings (Sweet Xv)', () => {
    settingsServiceSpy.createEventSettings.and.returnValue(
      of(messageResponseMock)
    );

    settingsServiceSpy
      .createEventSettings(sweetXvSetting, fullEventsMock.id)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMock);
      });

    expect(settingsServiceSpy.createEventSettings)
      .withContext('Expected createEventSettings to have been called')
      .toHaveBeenCalledOnceWith(sweetXvSetting, fullEventsMock.id);
  });

  it('should call createEventSettings (Save The Date)', () => {
    settingsServiceSpy.createEventSettings.and.returnValue(
      of(messageResponseMock)
    );

    settingsServiceSpy
      .createEventSettings(saveTheDateSetting, fullEventsMock.id)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMock);
      });

    expect(settingsServiceSpy.createEventSettings)
      .withContext('Expected createEventSettings to have been called')
      .toHaveBeenCalledOnceWith(saveTheDateSetting, fullEventsMock.id);
  });

  it('should call updateEventSettings (Sweet Xv)', () => {
    settingsServiceSpy.updateEventSettings.and.returnValue(
      of(messageResponseMock)
    );

    settingsServiceSpy
      .updateEventSettings(
        sweetXvSetting,
        fullEventsMock.id,
        fullEventsMock.typeOfEvent
      )
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMock);
      });

    expect(settingsServiceSpy.updateEventSettings)
      .withContext('Expected updateEventSettings to have been called')
      .toHaveBeenCalledOnceWith(
        sweetXvSetting,
        fullEventsMock.id,
        fullEventsMock.typeOfEvent
      );
  });

  it('should call updateEventSettings (Save The Date)', () => {
    settingsServiceSpy.updateEventSettings.and.returnValue(
      of(messageResponseMock)
    );

    settingsServiceSpy
      .updateEventSettings(
        saveTheDateSetting,
        fullEventsMock.id,
        fullEventsMock.typeOfEvent
      )
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMock);
      });

    expect(settingsServiceSpy.updateEventSettings)
      .withContext('Expected updateEventSettings to have been called')
      .toHaveBeenCalledOnceWith(
        saveTheDateSetting,
        fullEventsMock.id,
        fullEventsMock.typeOfEvent
      );
  });
});
