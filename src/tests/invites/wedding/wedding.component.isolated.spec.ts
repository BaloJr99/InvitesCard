import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { WeddingComponent } from 'src/app/invites/wedding/wedding.component';

describe('Wedding Component (Isolated Test)', () => {
  let component: WeddingComponent;
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
    params: of({ id: 1 }),
  });
  const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
  const filesSpy = jasmine.createSpyObj('FilesService', ['']);
  const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SettingsService, useValue: settingsSpy },
        { provide: FilesService, useValue: filesSpy },
        { provide: InvitesService, useValue: invitesSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: LOCALE_ID, useValue: 'en-US' },
      ],
    });
    component = TestBed.createComponent(WeddingComponent).componentInstance;
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
