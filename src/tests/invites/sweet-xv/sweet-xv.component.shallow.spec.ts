// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
// import { FilesService } from 'src/app/core/services/files.service';
// import { InvitesService } from 'src/app/core/services/invites.service';
// import { SettingsService } from 'src/app/core/services/settings.service';
// import { SweetXvComponent } from 'src/app/invites/sweet-xv/sweet-xv.component';
// import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
// import { deepCopy } from 'src/app/shared/utils/tools';
// import {
//   sweetXvBaseSettingMock,
//   sweetXvSettingMock,
//   sweetXvUserInviteMock,
// } from 'src/tests/mocks/mocks';

// const sweetXvBaseSettingMockCopy = deepCopy(sweetXvBaseSettingMock);
// const sweetXvSettingMockCopy = deepCopy(sweetXvSettingMock);
// const sweetXvUserInviteMockCopy = deepCopy(sweetXvUserInviteMock);

// describe('Sweet Xv Component (Shallow Test)', () => {
//   let fixture: ComponentFixture<SweetXvComponent>;
//   let invitesServiceSpy: jasmine.SpyObj<InvitesService>;
//   let filesServiceSpy: jasmine.SpyObj<FilesService>;
//   let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

//   beforeEach(waitForAsync(() => {
//     const settingsSpy = jasmine.createSpyObj('SettingsService', [
//       'getEventSettings',
//     ]);
//     const filesSpy = jasmine.createSpyObj('FilesService', ['getFilesByEvent']);
//     const invitesSpy = jasmine.createSpyObj('InvitesService', ['getInvite']);

//     TestBed.configureTestingModule({
//       declarations: [SweetXvComponent],
//       imports: [SafePipe],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             params: of({ id: sweetXvUserInviteMockCopy.id }),
//           },
//         },
//         { provide: SettingsService, useValue: settingsSpy },
//         { provide: FilesService, useValue: filesSpy },
//         { provide: InvitesService, useValue: invitesSpy },
//       ],
//     }).compileComponents();

//     invitesServiceSpy = TestBed.inject(
//       InvitesService
//     ) as jasmine.SpyObj<InvitesService>;
//     filesServiceSpy = TestBed.inject(
//       FilesService
//     ) as jasmine.SpyObj<FilesService>;
//     settingsServiceSpy = TestBed.inject(
//       SettingsService
//     ) as jasmine.SpyObj<SettingsService>;
//   }));

//   beforeEach(() => {
//     invitesServiceSpy.getInvite.and.returnValue(of(sweetXvUserInviteMockCopy));
//     settingsServiceSpy.getEventSettings.and.returnValue(
//       of(sweetXvBaseSettingMockCopy)
//     );
//     filesServiceSpy.getFilesByEvent.and.returnValue(
//       of({
//         eventImages: [],
//         eventAudios: [],
//       })
//     );

//     fixture = TestBed.createComponent(SweetXvComponent);
//     fixture.detectChanges();
//   });

//   it('should have the info section', () => {
//     const infoSection = fixture.debugElement.query(By.css('.info'));
//     const scrollButton = infoSection.query(By.css('button'));
//     const header = infoSection.query(By.css('.header'));
//     const mainHeader = header.query(By.css('h1'));
//     const nameOfCelebrated = header.query(By.css('p'));
//     const dateOfEvent = infoSection.query(By.css('.datetime .date p'));

//     expect(infoSection).withContext('Info section should exist').toBeTruthy();

//     expect(scrollButton).withContext('Scroll button should exist').toBeTruthy();
//     expect(mainHeader.nativeElement.textContent)
//       .withContext('Main header should exist')
//       .toContain('15Sweet');

//     expect(nameOfCelebrated.nativeElement.textContent)
//       .withContext('Name of celebrated should exist')
//       .toContain(sweetXvUserInviteMockCopy.nameOfCelebrated);
//     expect(dateOfEvent.nativeElement.textContent)
//       .withContext('Date of event should exist')
//       .toContain('FRIDAY, FEBRUARY 28');
//   });

//   it('should have the speech section', () => {
//     const speechSection = fixture.debugElement.query(By.css('.speech'));
//     const paragraphs = speechSection.queryAll(By.css('p'));
//     const firstSectionSentence1 = paragraphs[0];
//     const inviteFamiliy = paragraphs[1];
//     const numberOfEntries = paragraphs[2];
//     const firstSectionSentence2 = paragraphs[3];

//     expect(speechSection)
//       .withContext('Speech section should exist')
//       .toBeTruthy();
//     expect(firstSectionSentence1.nativeElement.textContent)
//       .withContext('First section sentence 1 should exist')
//       .toContain(sweetXvSettingMockCopy.firstSectionSentences.split(';')[0]);
//     expect(inviteFamiliy.nativeElement.textContent)
//       .withContext('Invite family should exist')
//       .toContain(sweetXvUserInviteMockCopy.family);
//     expect(numberOfEntries.nativeElement.textContent)
//       .withContext('Number of entries should exist')
//       .toContain(sweetXvUserInviteMockCopy.entriesNumber);
//     expect(firstSectionSentence2.nativeElement.textContent)
//       .withContext('First section sentence 2 should exist')
//       .toContain(sweetXvSettingMockCopy.firstSectionSentences.split(';')[1]);
//   });

//   it('should have the ceremony section', () => {
//     const ceremonySection = fixture.debugElement.query(By.css('.ceremony'));
//     const paragraphs = ceremonySection.queryAll(By.css('p'));
//     const father = paragraphs[1];
//     const mother = paragraphs[2];
//     const godParents1 = paragraphs[4];
//     const godParents2 = paragraphs[5];
//     const secondSectionSentences = paragraphs[6];
//     const ceremonyDate = paragraphs[7];
//     const ceremonyAddress = paragraphs[8];

//     expect(ceremonySection)
//       .withContext('Ceremony section should exist')
//       .toBeTruthy();
//     expect(father.nativeElement.textContent)
//       .withContext('Father should exist')
//       .toContain(sweetXvSettingMockCopy.parents.split(';')[0]);
//     expect(mother.nativeElement.textContent)
//       .withContext('Mother should exist')
//       .toContain(sweetXvSettingMockCopy.parents.split(';')[1]);
//     expect(godParents1.nativeElement.textContent)
//       .withContext('God parents should exist')
//       .toContain(sweetXvSettingMockCopy.godParents.split(';')[0]);
//     expect(godParents2.nativeElement.textContent)
//       .withContext('God parents should exist')
//       .toContain(sweetXvSettingMockCopy.godParents.split(';')[1]);
//     expect(secondSectionSentences.nativeElement.textContent)
//       .withContext('Second section sentences should exist')
//       .toContain(sweetXvSettingMockCopy.secondSectionSentences.split(';')[0]);
//     expect(ceremonyDate.nativeElement.textContent)
//       .withContext('Ceremony date should exist')
//       .toContain('Friday  February 28, 2025  17:00 horas');
//     expect(ceremonyAddress.nativeElement.textContent)
//       .withContext('Ceremony address should exist')
//       .toContain(sweetXvSettingMockCopy.massAddress);
//   });

//   it('should have the reception section', () => {
//     const receptionSection = fixture.debugElement.query(By.css('.reception'));
//     const receptionPlace = receptionSection.query(By.css('h3'));
//     const receptionAddress = receptionSection.query(By.css('p'));
//     const receptionTime = receptionSection.query(By.css('span'));

//     expect(receptionSection)
//       .withContext('Reception section should exist')
//       .toBeTruthy();
//     expect(receptionPlace.nativeElement.textContent)
//       .withContext('Reception place should exist')
//       .toContain(sweetXvSettingMockCopy.receptionPlace);
//     expect(receptionAddress.nativeElement.textContent)
//       .withContext('Reception address should exist')
//       .toContain(sweetXvSettingMockCopy.receptionAddress);
//     expect(receptionTime.nativeElement.textContent)
//       .withContext('Reception time should exist')
//       .toContain('18:00 horas');
//   });

//   it('should have the dressCode section', () => {
//     const dressCodeSection = fixture.debugElement.query(By.css('.dressCode'));
//     const paragraphs = dressCodeSection.queryAll(By.css('p'));
//     const dressCode = paragraphs[2];

//     expect(dressCodeSection)
//       .withContext('Dress Code section should exist')
//       .toBeTruthy();
//     expect(dressCode.nativeElement.textContent)
//       .withContext('Dress Code should exist')
//       .toContain(sweetXvSettingMockCopy.dressCodeColor);
//   });

//   it('should have the gifts section', () => {
//     const giftsSection = fixture.debugElement.query(By.css('.gifts'));

//     expect(giftsSection).withContext('Gifts section should exist').toBeTruthy();
//   });
// });
