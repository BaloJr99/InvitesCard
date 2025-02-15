import { ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { SaveTheDateComponent } from 'src/app/invites/save-the-date/save-the-date.component';

describe('Save The Date Settings Component (Isolated Test)', () => {
  let component: SaveTheDateComponent;

  beforeEach(() => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
      params: of({ id: 1 }),
    });
    const eventSettingsSpy = jasmine.createSpyObj('EventSettingsService', ['']);
    const filesSpy = jasmine.createSpyObj('FilesService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['']);
    const localeId = 'en-US';

    component = new SaveTheDateComponent(
      activatedRouteSpy,
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
    expect(component.downloadImages)
      .withContext('The downloadImages should be an empty array')
      .toEqual([]);
    expect(component.audio)
      .withContext('The audio should be an instance of Audio')
      .toBeInstanceOf(Audio);
    expect(component.playAudio)
      .withContext('Play audio should be false')
      .toBeFalse();
  });
});
