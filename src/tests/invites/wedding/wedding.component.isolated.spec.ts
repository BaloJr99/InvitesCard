import { ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeddingComponent } from 'src/app/invites/wedding/wedding.component';

describe('Wedding Component (Isolated Test)', () => {
  let component: WeddingComponent;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
    const filesSpy = jasmine.createSpyObj('FilesService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const localeId = 'en-US';

    component = new WeddingComponent(
      new ActivatedRoute(),
      routerSpy,
      loaderSpy,
      settingsSpy,
      filesSpy,
      invitesSpy,
      new ElementRef(null),
      localeId
    );
  });

  it('should create', () => {
    expect(component)
      .withContext('WeddingComponent should be created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.counter).withContext('Counter should be 0').toBe(0);
    expect(component.dayOfTheWeek)
      .withContext('Day of the week should be empty')
      .toBe('');
    expect(component.shortDate)
      .withContext('Short date should be empty')
      .toBe('');
    expect(component.longDate)
      .withContext('Long date should be empty')
      .toBe('');
    expect(component.userInvite)
      .withContext('User invite should be undefined')
      .toBeUndefined();
    expect(component.eventSettings)
      .withContext('Event settings should be empty')
      .toEqual({
        sections: [],
        eventId: '',
        primaryColor: '',
        secondaryColor: '',
        weddingPrimaryColor: '',
        weddingSecondaryColor: '',
        receptionPlace: '',
        groomParents: '',
        brideParents: '',
        massUrl: '',
        massTime: '',
        massPlace: '',
        venueUrl: '',
        venueTime: '',
        venuePlace: '',
        civilPlace: '',
        civilTime: '',
        civilUrl: '',
        dressCodeColor: '',
        copyMessage: '',
        hotelInformation: '',
        hotelName: '',
        hotelAddress: '',
        hotelPhone: '',
        hotelUrl: '',
        cardNumber: '',
        clabeBank: '',
      });
    expect(component.mainImage)
      .withContext('Download images should be empty')
      .toEqual(undefined);
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
      .withContext('Deadline met should be false')
      .toBeFalse();
    expect(component.gallery)
      .withContext('Download images should be empty')
      .toEqual([]);
  });
});
