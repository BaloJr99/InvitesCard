import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DesignType, EventType } from 'src/app/core/models/enum';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { InvitesComponent } from 'src/app/invites/invites.component';
import { SaveTheDateComponent } from 'src/app/invites/save-the-date/save-the-date.component';
import { SweetXvComponent } from 'src/app/invites/sweet-xv/sweet-xv.component';
import { newInviteMock } from '../mocks/mocks';
import { of } from 'rxjs';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  IEventTypeResolved,
  IInviteEventInformation,
} from 'src/app/core/models/invites';

const newInviteMockCopy = deepCopy(newInviteMock);

describe('Invites Component (Integrated Test)', () => {
  let fixture: ComponentFixture<InvitesComponent>;

  beforeEach(async () => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['']);
    const filesSpy = jasmine.createSpyObj('FilesService', ['']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);

    await TestBed.configureTestingModule({
      imports: [InvitesComponent, SweetXvComponent, SaveTheDateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                invite: {
                  eventInformation: {
                    designName: DesignType.Classic,
                    typeOfEvent: EventType.Xv,
                  } as IInviteEventInformation,
                },
              },
            },
            params: of({ id: newInviteMockCopy.id }),
          },
        },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: FilesService, useValue: filesSpy },
        { provide: InvitesService, useValue: invitesSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitesComponent);
    fixture.detectChanges();
  });

  it('should have render the app-sweet-xv if the eventType is X', () => {
    const appSweetXV = fixture.debugElement.query(
      By.directive(SweetXvComponent),
    );

    expect(appSweetXV)
      .withContext('The app-sweet-xv should be rendered')
      .toBeTruthy();
  });

  it('should have render the app-save-the-date if the eventType is S', () => {
    fixture.componentInstance.inviteResolved = {
      eventInformation: {
        designName: DesignType.None,
        typeOfEvent: EventType.SaveTheDate,
      },
    } as IEventTypeResolved;
    fixture.detectChanges();

    const appSaveTheDate = fixture.debugElement.query(
      By.directive(SaveTheDateComponent),
    );

    expect(appSaveTheDate)
      .withContext('The app-save-the-date should be rendered')
      .toBeTruthy();
  });
});
