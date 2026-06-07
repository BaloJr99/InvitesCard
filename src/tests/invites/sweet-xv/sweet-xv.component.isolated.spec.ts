import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SweetXvComponent } from 'src/app/invites/sweet-xv/sweet-xv.component';

describe('Sweet Xv Component (Isolated Test)', () => {
  let component: SweetXvComponent;
  const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
  const filesSpy = jasmine.createSpyObj('FilesService', ['']);
  const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
    params: of({ id: 1 }),
  });

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
    component = TestBed.createComponent(SweetXvComponent).componentInstance;
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
