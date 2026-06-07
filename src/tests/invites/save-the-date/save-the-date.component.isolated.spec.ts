import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SaveTheDateComponent } from 'src/app/invites/save-the-date/save-the-date.component';

describe('Save The Date Settings Component (Isolated Test)', () => {
  let component: SaveTheDateComponent;
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
    params: of({ id: 1 }),
  });
  const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
  const filesSpy = jasmine.createSpyObj('FilesService', ['']);
  const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
  const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: FilesService, useValue: filesSpy },
        { provide: InvitesService, useValue: invitesSpy },
        { provide: CommonModalService, useValue: commonModalSpy },
        { provide: LOCALE_ID, useValue: 'en-US' },
      ],
    });

    component = TestBed.createComponent(SaveTheDateComponent).componentInstance;
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
