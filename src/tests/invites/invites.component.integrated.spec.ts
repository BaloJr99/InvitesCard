import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { EventType } from 'src/app/core/models/enum';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { InvitesComponent } from 'src/app/invites/invites.component';
import { SaveTheDateComponent } from 'src/app/invites/save-the-date/save-the-date.component';
import { SweetXvComponent } from 'src/app/invites/sweet-xv/sweet-xv.component';
import { newInviteMock } from '../mocks/mocks';
import { of } from 'rxjs';
import { deepCopy } from 'src/app/shared/utils/tools';

const newInviteMockCopy = deepCopy(newInviteMock);

describe('Invites Component (Shallow Test)', () => {
  let fixture: ComponentFixture<InvitesComponent>;

  beforeEach(waitForAsync(() => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
    const filesSpy = jasmine.createSpyObj('FilesService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);

    TestBed.configureTestingModule({
      declarations: [InvitesComponent, SweetXvComponent, SaveTheDateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { invite: { eventType: EventType.Xv } },
            },
            params: of({ id: newInviteMockCopy.id }),
          },
        },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: FilesService, useValue: filesSpy },
        { provide: InvitesService, useValue: invitesSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitesComponent);
    fixture.detectChanges();
  });

  it('should have render the app-sweet-xv if the eventType is X', () => {
    const appSweetXV = fixture.debugElement.query(
      By.directive(SweetXvComponent)
    );

    expect(appSweetXV)
      .withContext('The app-sweet-xv should be rendered')
      .toBeTruthy();
  });

  it('should have render the app-save-the-date if the eventType is S', () => {
    fixture.componentInstance.inviteResolved = {
      eventType: EventType.SaveTheDate,
    };
    fixture.detectChanges();

    const appSaveTheDate = fixture.debugElement.query(
      By.directive(SaveTheDateComponent)
    );

    expect(appSaveTheDate)
      .withContext('The app-save-the-date should be rendered')
      .toBeTruthy();
  });
});
