import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { WeddingComponent } from 'src/app/invites/wedding/wedding.component';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import {
  weddingBaseSettingMock,
  weddingSettingMock,
  weddingUserInviteMock,
} from 'src/tests/mocks/mocks';

// Utility function to create a deep copy of the mock object
function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

describe('Wedding Component (Shallow Test)', () => {
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
      declarations: [WeddingComponent],
      imports: [SafePipe],
      schemas: [NO_ERRORS_SCHEMA],
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
      of({
        ...weddingBaseSettingMock,
      })
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

  it('should have the info section', () => {
    const infoSection = fixture.debugElement.query(By.css('.info'));
    const scrollButton = infoSection.query(By.css('button'));
    const header = infoSection.query(By.css('.header'));
    const mainHeader = header.query(By.css('h1'));
    const nameOfCelebrated = header.query(By.css('h2'));
    const dateOfEvent = infoSection.query(By.css('.datetime .date p'));

    expect(infoSection).withContext('Info section should exist').toBeTruthy();

    expect(scrollButton).withContext('Scroll button should exist').toBeTruthy();
    expect(mainHeader.nativeElement.textContent)
      .withContext('Main header should exist')
      .toContain('Nuestra boda');

    expect(nameOfCelebrated.nativeElement.textContent)
      .withContext('Name of celebrated should exist')
      .toContain(
        `${weddingUserInviteMock.nameOfCelebrated.split(';')[0]} & ${
          weddingUserInviteMock.nameOfCelebrated.split(';')[1]
        }`
      );
    expect(dateOfEvent.nativeElement.textContent)
      .withContext('Date of event should exist')
      .toContain('THURSDAY, JULY 1');
  });

  it('should have the speech section', () => {
    const speechSection = fixture.debugElement.query(By.css('.speech'));
    const paragraphs = speechSection.queryAll(By.css('p'));
    const familyName = paragraphs[0];
    const brideParentsFather = paragraphs[3];
    const brideParentsMother = paragraphs[4];
    const groomParentsFather = paragraphs[5];
    const groomParentsMother = paragraphs[6];

    expect(speechSection)
      .withContext('Speech section should exist')
      .toBeTruthy();
    expect(familyName.nativeElement.textContent)
      .withContext('Family name should exist')
      .toContain(weddingUserInviteMock.family);
    expect(brideParentsFather.nativeElement.textContent)
      .withContext('Bride parents father should exist')
      .toContain(weddingSettingMock.brideParents.split(';')[0]);
    expect(brideParentsMother.nativeElement.textContent)
      .withContext('Bride parents mother should exist')
      .toContain(weddingSettingMock.brideParents.split(';')[1]);
    expect(groomParentsFather.nativeElement.textContent)
      .withContext('Groom parents father should exist')
      .toContain(weddingSettingMock.groomParents.split(';')[0]);
    expect(groomParentsMother.nativeElement.textContent)
      .withContext('Groom parents mother should exist')
      .toContain(weddingSettingMock.groomParents.split(';')[1]);
  });

  it('should have the itinerary section', () => {
    const itinerarySection = fixture.debugElement.query(By.css('.itinerary'));
    const itineraryBoxes = itinerarySection.queryAll(By.css('.box'));
    const massBox = itineraryBoxes[0];
    const civilBox = itineraryBoxes[1];
    const venueBox = itineraryBoxes[2];
    const massParagraphs = massBox.queryAll(By.css('p'));
    const massTime = massParagraphs[0];
    const massAddress = massParagraphs[1];
    const civilParagraphs = civilBox.queryAll(By.css('p'));
    const civilTime = civilParagraphs[0];
    const civilAddress = civilParagraphs[1];
    const venueParagraphs = venueBox.queryAll(By.css('p'));
    const venueTime = venueParagraphs[0];
    const venueAddress = venueParagraphs[1];

    expect(itinerarySection)
      .withContext('Itinerary section should exist')
      .toBeTruthy();
    expect(massTime.nativeElement.textContent)
      .withContext('Mass time should exist')
      .toContain(weddingSettingMock.massTime);
    expect(massAddress.nativeElement.textContent)
      .withContext('Mass address should exist')
      .toContain(weddingSettingMock.massPlace);
    expect(civilTime.nativeElement.textContent)
      .withContext('Civil time should exist')
      .toContain(weddingSettingMock.civilTime);
    expect(civilAddress.nativeElement.textContent)
      .withContext('Civil address should exist')
      .toContain(weddingSettingMock.civilPlace);
    expect(venueTime.nativeElement.textContent)
      .withContext('Venue time should exist')
      .toContain(weddingSettingMock.venueTime);
    expect(venueAddress.nativeElement.textContent)
      .withContext('Venue address should exist')
      .toContain(weddingSettingMock.venuePlace);
  });

  it('should have the dressCode section', () => {
    const dressCodeSection = fixture.debugElement.query(By.css('.dressCode'));
    const paragraphs = dressCodeSection.queryAll(By.css('p'));
    const dressCode = paragraphs[2];

    expect(dressCodeSection)
      .withContext('Dress Code section should exist')
      .toBeTruthy();
    expect(dressCode.nativeElement.textContent)
      .withContext('Dress Code should exist')
      .toContain(weddingSettingMock.dressCodeColor);
  });

  it('should have the gifts section', () => {
    const giftsSection = fixture.debugElement.query(By.css('.gifts'));
    const paragraphs = giftsSection.queryAll(By.css('p'));
    const clabeBank = paragraphs[3];
    const cardNumber = paragraphs[5];

    expect(giftsSection).withContext('Gifts section should exist').toBeTruthy();
    expect(clabeBank.nativeElement.textContent)
      .withContext('Clabe bank should exist')
      .toContain(weddingSettingMock.clabeBank);
    expect(cardNumber.nativeElement.textContent)
      .withContext('Card number should exist')
      .toContain(weddingSettingMock.cardNumber);
  });

  it('should have the confirmation section', () => {
    const confirmationSection = fixture.debugElement.query(
      By.css('.invitesConfirmation')
    );

    expect(confirmationSection)
      .withContext('Confirmation section should exist')
      .toBeTruthy();
  });

  it('should have the accomodation section', () => {
    const accomodationSection = fixture.debugElement.query(
      By.css('.accomodations')
    );
    const paragraphs = accomodationSection.queryAll(By.css('p'));
    const hotelName = accomodationSection.query(By.css('h3'));
    const hotelAddress = paragraphs[0];
    const hotelPhone = paragraphs[1];

    expect(accomodationSection)
      .withContext('Accomodation section should exist')
      .toBeTruthy();
    expect(hotelName.nativeElement.textContent)
      .withContext('Hotel name should exist')
      .toContain(weddingSettingMock.hotelName);
    expect(hotelAddress.nativeElement.textContent)
      .withContext('Hotel address should exist')
      .toContain(weddingSettingMock.hotelAddress);
    expect(hotelPhone.nativeElement.textContent)
      .withContext('Hotel phone should exist')
      .toContain(weddingSettingMock.hotelPhone);
  });

  it('should have the gallery section', () => {
    const gallerySection = fixture.debugElement.query(By.css('.gallery'));

    expect(gallerySection)
      .withContext('Confirmation section should exist')
      .toBeTruthy();
  });
});
