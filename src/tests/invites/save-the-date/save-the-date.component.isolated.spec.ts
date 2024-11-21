import { ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaveTheDateComponent } from 'src/app/invites/save-the-date/save-the-date.component';

describe('Save The Date Settings Component (Isolated Test)', () => {
  let component: SaveTheDateComponent;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const eventSettingsSpy = jasmine.createSpyObj('EventSettingsService', ['']);
    const filesSpy = jasmine.createSpyObj('FilesService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['']);
    const localeId = 'en-US';

    component = new SaveTheDateComponent(
      new ActivatedRoute(),
      routerSpy,
      loaderSpy,
      eventSettingsSpy,
      filesSpy,
      invitesSpy,
      new ElementRef(null),
      commonModalSpy,
      localeId
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.counter)
      .withContext('The counter value should be 0')
      .toBe(0);
    expect(component.userInvite)
      .withContext('The userInvite should be undefined')
      .toBeUndefined();
    expect(component.eventSettings)
      .withContext('The eventSettings should be initialized')
      .toEqual({
        eventId: '',
        primaryColor: '',
        secondaryColor: '',
        receptionPlace: '',
        copyMessage: '',
        hotelName: '',
        hotelInformation: '',
      });

    expect(component.shortDate)
      .withContext('The shortDate should be an empty string')
      .toBe('');
    expect(component.dateDictionary)
      .withContext('The dateDictionary should be an empty array')
      .toEqual([]);
    expect(component.downloadImages)
      .withContext('The downloadImages should be an empty array')
      .toEqual([]);
    expect(component.downloadAudio)
      .withContext('The downloadAudio should be undefined')
      .toBeUndefined();
    expect(component.audio)
      .withContext('The audio should be an instance of Audio')
      .toBeInstanceOf(Audio);
    expect(component.playAudio)
      .withContext('Play audio should be false')
      .toBeFalse();
    expect(component.deadlineMet)
      .withContext('DeadlineMet should be false')
      .toBeFalse();
  });
});
