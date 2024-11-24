import { ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SweetXvComponent } from 'src/app/invites/sweet-xv/sweet-xv.component';

describe('Sweet Xv Component (Isolated Test)', () => {
  let component: SweetXvComponent;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
    const filesSpy = jasmine.createSpyObj('FilesService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const localeId = 'en-US';

    component = new SweetXvComponent(
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
      .withContext('SweetXvComponent should be created')
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
        eventId: '',
        primaryColor: '',
        secondaryColor: '',
        parents: '',
        godParents: '',
        firstSectionSentences: '',
        secondSectionSentences: '',
        massUrl: '',
        massTime: '',
        massAddress: '',
        receptionUrl: '',
        receptionTime: '',
        receptionPlace: '',
        receptionAddress: '',
        dressCodeColor: '',
      });
    expect(component.downloadImages)
      .withContext('Download images should be empty')
      .toEqual([]);
    expect(component.deadlineMet)
      .withContext('Deadline met should be false')
      .toBeFalse();
  });
});
