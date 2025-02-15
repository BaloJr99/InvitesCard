import { ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { SweetXvComponent } from 'src/app/invites/sweet-xv/sweet-xv.component';

describe('Sweet Xv Component (Isolated Test)', () => {
  let component: SweetXvComponent;

  beforeEach(() => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
    const filesSpy = jasmine.createSpyObj('FilesService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
      params: of({ id: 1 }),
    });
    const localeId = 'en-US';

    component = new SweetXvComponent(
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
      .withContext('SweetXvComponent should be created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.counter).withContext('Counter should be 0').toBe(0);
    expect(component.downloadImages)
      .withContext('Download images should be empty')
      .toEqual([]);
  });
});
