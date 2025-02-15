import { ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { WeddingComponent } from 'src/app/invites/wedding/wedding.component';

describe('Wedding Component (Isolated Test)', () => {
  let component: WeddingComponent;

  beforeEach(() => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
      params: of({ id: 1 }),
    });
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
    const filesSpy = jasmine.createSpyObj('FilesService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const localeId = 'en-US';

    component = new WeddingComponent(
      activatedRouteSpy,
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
    expect(component.audio)
      .withContext('The audio should be an instance of Audio')
      .toBeInstanceOf(Audio);
    expect(component.playAudio)
      .withContext('Play audio should be false')
      .toBeFalse();
  });
});
