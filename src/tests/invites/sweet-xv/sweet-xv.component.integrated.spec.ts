import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ConfirmationComponent } from 'src/app/invites/shared/confirmation/confirmation.component';
import { CountdownComponent } from 'src/app/invites/shared/countdown/countdown.component';
import { SweetXvComponent } from 'src/app/invites/sweet-xv/sweet-xv.component';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  sweetXvBaseSettingMock,
  sweetXvUserInviteMock,
} from 'src/tests/mocks/mocks';

const sweetXvBaseSettingMockCopy = deepCopy(sweetXvBaseSettingMock);
const sweetXvUserInviteMockCopy = deepCopy(sweetXvUserInviteMock);

describe('Sweet Xv Component (Integrated Test)', () => {
  let fixture: ComponentFixture<SweetXvComponent>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;
  let filesServiceSpy: jasmine.SpyObj<FilesService>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', [
      'getEventSettings',
    ]);
    const filesSpy = jasmine.createSpyObj('FilesService', ['getFilesByEvent']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['getInvite']);

    await TestBed.configureTestingModule({
      imports: [
        CountdownComponent,
        ConfirmationComponent,
        SafePipe,
        SweetXvComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: sweetXvUserInviteMockCopy.id }),
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

    invitesServiceSpy.getInvite.and.returnValue(of(sweetXvUserInviteMockCopy));
    settingsServiceSpy.getEventSettings.and.returnValue(
      of(sweetXvBaseSettingMockCopy)
    );
    filesServiceSpy.getFilesByEvent.and.returnValue(
      of({
        eventImages: [],
        eventAudios: [],
      })
    );

    fixture = TestBed.createComponent(SweetXvComponent);
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
