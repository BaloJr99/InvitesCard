import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { InvitesService } from 'src/app/core/services/invites.service';
import { AccomodationComponent } from 'src/app/invites/save-the-date/accomodations/accomodation.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  saveTheDateSettingMock,
  saveTheDateUserInviteMock,
} from 'src/tests/mocks/mocks';

const saveTheDateSettingMockCopy = deepCopy(saveTheDateSettingMock);
const saveTheDateUserInviteMockCopy = deepCopy(saveTheDateUserInviteMock);

describe('Accomodation Component (Shallow Test)', () => {
  let fixture: ComponentFixture<AccomodationComponent>;

  beforeEach(waitForAsync(() => {
    const invitesSpy: jasmine.SpyObj<InvitesService> = jasmine.createSpyObj(
      'InvitesService',
      ['']
    );

    TestBed.configureTestingModule({
      declarations: [AccomodationComponent],
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: saveTheDateUserInviteMockCopy.id,
              }),
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccomodationComponent);
    fixture.detectChanges();
  });

  it('should have a paragraph with the section name, 2 inputs with labels and 1 send button', () => {
    fixture.componentRef.setInput('invite', {
      ...saveTheDateUserInviteMockCopy,
      needsAccomodation: null,
    });

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('.form'));
    const paragraph = form.query(By.css('p'));
    const inputs = form.queryAll(By.css('input'));
    const labels = form.queryAll(By.css('label'));
    const button = form.query(By.css('button'));

    expect(paragraph.nativeElement.textContent)
      .withContext('Should have the section name')
      .toContain('Require hospedaje?');
    expect(inputs.length).withContext('Should have 2 inputs').toBe(2);
    expect(labels.length).withContext('Should have 2 labels').toBe(2);
    expect(labels[0].nativeElement.textContent)
      .withContext('First input label should be Si')
      .toContain('Si');
    expect(labels[1].nativeElement.textContent)
      .withContext('Second input label should be No')
      .toContain('No');
    expect(button.nativeElement.textContent)
      .withContext('Should have a button with the text "Send"')
      .toContain('ENVIAR');
  });

  it('should have a warning message if the deadline is met', () => {
    fixture.componentRef.setInput('invite', {
      ...saveTheDateUserInviteMockCopy,
      needsAccomodation: null,
    });
    fixture.componentRef.setInput('deadlineMet', true);
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    const warning = form.query(By.css('.question span'));

    expect(warning.nativeElement.textContent)
      .withContext('Should have the section name')
      .toContain('Este formulario no acepta mas respuestas');
  });

  it('should show the confirmed modal when the form has been filled', () => {
    fixture.componentRef.setInput('invite', {
      ...saveTheDateUserInviteMockCopy,
      needsAccomodation: true,
    });

    fixture.componentRef.setInput('inviteSettings', {
      ...saveTheDateSettingMockCopy,
    });

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('.confirmed'));
    const paragraphs = form.queryAll(By.css('p'));
    const spans = form.queryAll(By.css('span'));
    const link = form.query(By.css('a'));

    expect(paragraphs[0].nativeElement.textContent)
      .withContext('Should have the greeting message')
      .toContain('Muchas gracias por su tiempo.');
    expect(paragraphs[1].nativeElement.textContent)
      .withContext('Should have the closing message')
      .toContain('Puede cerrar la página');
    expect(spans[0].nativeElement.textContent)
      .withContext('Should have the confirmation message')
      .toContain('Su respuesta ha sido enviada');
    expect(spans[1].nativeElement.textContent)
      .withContext('Should have the section name')
      .toContain('Le compartimos el Flyer con información sobre el hotel');
    expect(link.nativeElement.textContent)
      .withContext('Should have the section name')
      .toContain(saveTheDateSettingMockCopy.hotelName);
  });
});
