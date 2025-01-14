import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ConfirmationComponent } from 'src/app/invites/shared/confirmation/confirmation.component';
import { CountdownComponent } from 'src/app/invites/shared/countdown/countdown.component';
import { WeddingComponent } from 'src/app/invites/wedding/wedding.component';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import {
  weddingBaseSettingMock,
  weddingUserInviteMock,
} from 'src/tests/mocks/mocks';

// Utility function to create a deep copy of the mock object
function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

describe('Wedding Component (Integrated Test)', () => {
  let fixture: ComponentFixture<WeddingComponent>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;
  let filesServiceSpy: jasmine.SpyObj<FilesService>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(waitForAsync(() => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', [
      'getEventSettings',
    ]);
    const filesSpy = jasmine.createSpyObj('FilesService', ['getFilesByEvent']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['getInvite']);

    TestBed.configureTestingModule({
      declarations: [
        CountdownComponent,
        ConfirmationComponent,
        WeddingComponent,
      ],
      imports: [SafePipe],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: weddingUserInviteMock.id }),
          },
        },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: FilesService, useValue: filesSpy },
        { provide: InvitesService, useValue: invitesSpy },
      ],
    }).compileComponents();

    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;
    filesServiceSpy = TestBed.inject(
      FilesService
    ) as jasmine.SpyObj<FilesService>;
    settingsServiceSpy = TestBed.inject(
      SettingsService
    ) as jasmine.SpyObj<SettingsService>;
  }));

  beforeEach(() => {
    invitesServiceSpy.getInvite.and.returnValue(
      of(deepCopy(weddingUserInviteMock))
    );
    settingsServiceSpy.getEventSettings.and.returnValue(
      of(weddingBaseSettingMock)
    );
    filesServiceSpy.getFilesByEvent.and.returnValue(
      of({
        eventImages: [],
        eventAudios: [],
      })
    );

    fixture = TestBed.createComponent(WeddingComponent);
    fixture.detectChanges();
  });

  it('should have the invitesConfirmation with the app-confirmation component', () => {
    const invitesConfirmationSection = fixture.debugElement.query(
      By.css('.invitesConfirmation')
    );
    const confirmation = invitesConfirmationSection.query(
      By.css('app-confirmation')
    );

    expect(invitesConfirmationSection)
      .withContext('Invites Confirmation section should exist')
      .toBeTruthy();
    expect(confirmation)
      .withContext('Confirmation component should exist')
      .toBeTruthy();
  });
});
