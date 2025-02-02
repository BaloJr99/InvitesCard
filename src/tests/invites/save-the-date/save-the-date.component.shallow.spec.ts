import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CommonModalResponse } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SaveTheDateComponent } from 'src/app/invites/save-the-date/save-the-date.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  saveTheDateBaseSettingMock,
  saveTheDateUserInviteMock,
} from 'src/tests/mocks/mocks';

const saveTheDateBaseSettingMockCopy = deepCopy(saveTheDateBaseSettingMock);
const saveTheDateUserInviteMockCopy = deepCopy(saveTheDateUserInviteMock);

describe('Save The Date Component (Shallow Test)', () => {
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
      declarations: [SaveTheDateComponent],
      schemas: [NO_ERRORS_SCHEMA],
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

  it('should call generateCalendar on ngOnInit', () => {
    expect(fixture.componentInstance.generateCalendar)
      .withContext('generateCalendar should be called')
      .toHaveBeenCalled();
  });

  it('should render the info section', () => {
    const infoSection = fixture.debugElement.query(By.css('.info'));
    const header = infoSection.query(By.css('.header'));
    const mainHeader = header.query(By.css('h1'));
    const names = header.query(By.css('.names'));

    expect(infoSection)
      .withContext('Info section should be rendered')
      .toBeTruthy();
    expect(mainHeader.nativeElement.textContent)
      .withContext('Main header should be rendered')
      .toBe('SAVE The DATE');

    const namesOfCouple = saveTheDateUserInviteMockCopy.nameOfCelebrated.split(';');
    expect(names.nativeElement.textContent)
      .withContext('Names should be rendered')
      .toContain(namesOfCouple[0]);
    expect(names.nativeElement.textContent)
      .withContext('Names should be rendered')
      .toContain(namesOfCouple[1]);
  });

  it('should render the reception section', fakeAsync(() => {
    const receptionSection = fixture.debugElement.query(By.css('.reception'));
    const receptionInfo = receptionSection.queryAll(By.css('p span'));
    const receptionDate = receptionInfo[0];
    const receptionPlace = receptionInfo[1];
    const table = receptionSection.query(By.css('table'));
    const tableHeaders = table.queryAll(By.css('thead th'));
    const receptionPhrase = receptionSection.query(By.css('.phrase'));
    const receptionBanner = receptionSection.query(By.css('.banner'));

    const daysOfTheWeek = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'];

    expect(receptionSection)
      .withContext('Reception section should be rendered')
      .toBeTruthy();
    expect(receptionDate.nativeElement.textContent)
      .withContext('Reception Date should be rendered')
      .toBe('FEBRUARY 2025');
    expect(receptionPlace.nativeElement.textContent)
      .withContext('Reception Place should be rendered')
      .toBe('Test Place');
    tableHeaders.forEach((header, index) => {
      expect(header.nativeElement.textContent)
        .withContext('Table headers should be rendered')
        .toBe(daysOfTheWeek[index]);
    });
    expect(receptionPhrase.nativeElement.textContent)
      .withContext('Reception Phrase should be rendered')
      .toContain('Dos corazones, una vida.  ¿Nos acompañas?');
    expect(receptionBanner.nativeElement.textContent)
      .withContext('Reception Banner should be rendered')
      .toBe('Próximamente: Invitación oficial.');
  }));
});
