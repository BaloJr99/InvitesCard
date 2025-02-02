import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SettingsService } from 'src/app/core/services/settings.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  baseSettingMock,
  fullEventsMock,
  messageResponseMock,
  saveTheDateSettingMock,
  sweetXvSettingMock,
} from 'src/tests/mocks/mocks';

const baseSettingMockCopy = deepCopy(baseSettingMock);
const fullEventsMockCopy = deepCopy(fullEventsMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);
const saveTheDateSettingMockCopy = deepCopy(saveTheDateSettingMock);
const sweetXvSettingMockCopy = deepCopy(sweetXvSettingMock);

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
    settingsServiceSpy.getEventSettings.and.returnValue(
      of(baseSettingMockCopy)
    );

    settingsServiceSpy
      .getEventSettings(fullEventsMockCopy.id)
      .subscribe((response) => {
        expect(response).toEqual(baseSettingMockCopy);
        expect(response.eventId).toEqual(fullEventsMockCopy.id);
      });

    expect(settingsServiceSpy.getEventSettings)
      .withContext('Expected getEventSettings to have been called')
      .toHaveBeenCalledOnceWith(fullEventsMockCopy.id);
  });

  it('should call createEventSettings (Sweet Xv)', () => {
    settingsServiceSpy.createEventSettings.and.returnValue(
      of(messageResponseMockCopy)
    );

    settingsServiceSpy
      .createEventSettings(sweetXvSettingMockCopy, fullEventsMockCopy.id)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMockCopy);
      });

    expect(settingsServiceSpy.createEventSettings)
      .withContext('Expected createEventSettings to have been called')
      .toHaveBeenCalledOnceWith(sweetXvSettingMockCopy, fullEventsMockCopy.id);
  });

  it('should call createEventSettings (Save The Date)', () => {
    settingsServiceSpy.createEventSettings.and.returnValue(
      of(messageResponseMockCopy)
    );

    settingsServiceSpy
      .createEventSettings(saveTheDateSettingMockCopy, fullEventsMockCopy.id)
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMockCopy);
      });

    expect(settingsServiceSpy.createEventSettings)
      .withContext('Expected createEventSettings to have been called')
      .toHaveBeenCalledOnceWith(
        saveTheDateSettingMockCopy,
        fullEventsMockCopy.id
      );
  });

  it('should call updateEventSettings (Sweet Xv)', () => {
    settingsServiceSpy.updateEventSettings.and.returnValue(
      of(messageResponseMockCopy)
    );

    settingsServiceSpy
      .updateEventSettings(
        sweetXvSettingMockCopy,
        fullEventsMockCopy.id,
        fullEventsMockCopy.typeOfEvent
      )
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMockCopy);
      });

    expect(settingsServiceSpy.updateEventSettings)
      .withContext('Expected updateEventSettings to have been called')
      .toHaveBeenCalledOnceWith(
        sweetXvSettingMockCopy,
        fullEventsMockCopy.id,
        fullEventsMockCopy.typeOfEvent
      );
  });

  it('should call updateEventSettings (Save The Date)', () => {
    settingsServiceSpy.updateEventSettings.and.returnValue(
      of(messageResponseMockCopy)
    );

    settingsServiceSpy
      .updateEventSettings(
        saveTheDateSettingMockCopy,
        fullEventsMockCopy.id,
        fullEventsMockCopy.typeOfEvent
      )
      .subscribe((response) => {
        expect(response).toEqual(messageResponseMockCopy);
      });

    expect(settingsServiceSpy.updateEventSettings)
      .withContext('Expected updateEventSettings to have been called')
      .toHaveBeenCalledOnceWith(
        saveTheDateSettingMockCopy,
        fullEventsMockCopy.id,
        fullEventsMockCopy.typeOfEvent
      );
  });
});
