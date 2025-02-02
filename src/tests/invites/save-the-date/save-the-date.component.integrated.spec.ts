import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CommonModalResponse } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { AccomodationComponent } from 'src/app/invites/save-the-date/accomodations/accomodation.component';
import { SaveTheDateComponent } from 'src/app/invites/save-the-date/save-the-date.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  saveTheDateBaseSettingMock,
  saveTheDateUserInviteMock,
} from 'src/tests/mocks/mocks';

const saveTheDateBaseSettingMockCopy = deepCopy(saveTheDateBaseSettingMock);
const saveTheDateUserInviteMockCopy = deepCopy(saveTheDateUserInviteMock);

describe('Save The Date Component (Integrated Test)', () => {
  let fixture: ComponentFixture<SaveTheDateComponent>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let filesServiceSpy: jasmine.SpyObj<FilesService>;
  let commonModalServiceSpy: jasmine.SpyObj<CommonModalService>;

  beforeEach(waitForAsync(() => {
    const settingsSpy = jasmine.createSpyObj('SettingsService', [
      'getEventSettings',
    ]);
    const filesSpy = jasmine.createSpyObj('FilesService', ['getFilesByEvent']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['getInvite']);
    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['open']);

    TestBed.configureTestingModule({
      declarations: [AccomodationComponent, SaveTheDateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: saveTheDateUserInviteMockCopy.id }),
          },
        },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: FilesService, useValue: filesSpy },
        { provide: InvitesService, useValue: invitesSpy },
        { provide: CommonModalService, useValue: commonModalSpy },
      ],
    });

    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;
    settingsServiceSpy = TestBed.inject(
      SettingsService
    ) as jasmine.SpyObj<SettingsService>;
    filesServiceSpy = TestBed.inject(
      FilesService
    ) as jasmine.SpyObj<FilesService>;
    commonModalServiceSpy = TestBed.inject(
      CommonModalService
    ) as jasmine.SpyObj<CommonModalService>;
    settingsServiceSpy.getEventSettings.and.returnValue(
      of(saveTheDateBaseSettingMockCopy)
    );
  }));

  beforeEach(() => {
    filesServiceSpy.getFilesByEvent.and.returnValue(
      of({
        eventImages: [],
        eventAudios: [],
      })
    );
    settingsServiceSpy.getEventSettings.and.returnValue(
      of(saveTheDateBaseSettingMockCopy)
    );
    commonModalServiceSpy.open.and.returnValue(of(CommonModalResponse.Cancel));
    invitesServiceSpy.getInvite.and.returnValue(
      of(saveTheDateUserInviteMockCopy)
    );

    fixture = TestBed.createComponent(SaveTheDateComponent);

    spyOn(fixture.componentInstance, 'generateCalendar');

    fixture.detectChanges();
  });

  it('should render the accomodation component', () => {
    const accomodationComponent = fixture.debugElement.query(
      By.directive(AccomodationComponent)
    );

    expect(accomodationComponent)
      .withContext('Accomodation component should be rendered')
      .toBeTruthy();
  });
});
