import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { InvitesService } from 'src/app/core/services/invites.service';
import { ConfirmationComponent } from 'src/app/invites/shared/confirmation/confirmation.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  confirmationInviteMock,
  messageResponseMock,
  saveTheDateUserInviteMock,
  sweetXvUserInviteMock,
} from 'src/tests/mocks/mocks';

const confirmationInviteMockCopy = deepCopy(confirmationInviteMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);
const saveTheDateUserInviteMockCopy = deepCopy(saveTheDateUserInviteMock);
const sweetXvUserInviteMockCopy = deepCopy(sweetXvUserInviteMock);

describe('Confirmation Component (Shallow Test)', () => {
  let fixture: ComponentFixture<ConfirmationComponent>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;

  const updateFormUsingEvent = (
    confirmation: boolean | null,
    entriesConfirmed: number | null,
    message: string
  ) => {
    const radioButtons = fixture.debugElement.queryAll(
      By.css('input[type=radio]')
    );
    const entriesConfirmedSelect = fixture.debugElement.query(By.css('select'));
    const messageInput = fixture.debugElement.query(By.css('textarea'));

    radioButtons[confirmation ? 0 : 1].nativeElement.click();
    entriesConfirmedSelect.nativeElement.value = entriesConfirmed;
    entriesConfirmedSelect.nativeElement.dispatchEvent(new Event('change'));

    messageInput.nativeElement.value = message;
    messageInput.nativeElement.dispatchEvent(new Event('input'));
  };

  beforeEach(waitForAsync(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', [
      'sendConfirmation',
    ]);
    TestBed.configureTestingModule({
      declarations: [ConfirmationComponent],
      imports: [ReactiveFormsModule, ValidationPipe, ValidationErrorPipe],
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                paramMap: convertToParamMap({
                  id: sweetXvUserInviteMockCopy.id,
                }),
              },
            },
          },
        },
      ],
    }).compileComponents();

    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;
  }));

  beforeEach(() => {
    invitesServiceSpy.sendConfirmation.and.returnValue(
      of(messageResponseMockCopy)
    );

    fixture = TestBed.createComponent(ConfirmationComponent);
    fixture.detectChanges();
  });

  it('should render the confirmation information', () => {
    fixture.componentRef.setInput('inviteValue', {
      ...sweetXvUserInviteMockCopy,
      confirmation: null,
    });
    fixture.componentRef.setInput('deadlineMet', false);
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('h2'));
    const bannerParagraph = fixture.debugElement.query(By.css('p'));

    const confirmationForm = fixture.debugElement.query(By.css('.form'));
    const assistHeader = confirmationForm.query(By.css('h3'));
    const paragraphs = confirmationForm.queryAll(By.css('p'));
    const labels = confirmationForm.queryAll(By.css('label'));
    const inputs = confirmationForm.queryAll(By.css('input'));
    const selectInput = confirmationForm.query(By.css('select'));
    const messageInput = confirmationForm.query(By.css('textarea'));
    const sendButton = confirmationForm.query(By.css('button'));

    expect(header.nativeElement.textContent)
      .withContext('The header should display the title of the page')
      .toContain('Confirmación');

    expect(bannerParagraph.nativeElement.textContent)
      .withContext('The banner paragraph should be displayed')
      .toContain(
        'Es muy importante para nosotros contar con tu confirmación lo antes posible'
      );

    expect(assistHeader.nativeElement.textContent)
      .withContext('The assist header should be displayed')
      .toContain('¿ASISTIRÁS A MI EVENTO?');

    expect(paragraphs[0].nativeElement.textContent)
      .withContext('The first paragraph should be displayed')
      .toContain('Selecciona una opción');

    expect(labels[0].nativeElement.textContent)
      .withContext('The first label should be displayed')
      .toContain('Asistiré');

    expect(labels[1].nativeElement.textContent)
      .withContext('The second label should be displayed')
      .toContain('No asistiré');

    expect(inputs.length)
      .withContext('There should be two radio buttons')
      .toBe(2);

    expect(paragraphs[1].nativeElement.textContent)
      .withContext('The second paragraph should be displayed')
      .toContain('Personas confirmadas');

    expect(selectInput)
      .withContext('The select input should be displayed')
      .toBeTruthy();

    expect(paragraphs[2].nativeElement.textContent)
      .withContext('The third paragraph should be displayed')
      .toContain('¡Envía una felicitación!');

    expect(messageInput)
      .withContext('The message input should be displayed')
      .toBeTruthy();

    expect(sendButton.nativeElement.textContent)
      .withContext('The send button should be displayed')
      .toContain('ENVIAR');
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    fixture.componentRef.setInput('inviteValue', {
      ...sweetXvUserInviteMockCopy,
      confirmation: null,
      entriesConfirmed: null,
      message: null,
    });
    fixture.componentRef.setInput('deadlineMet', false);
    fixture.detectChanges();

    updateFormUsingEvent(
      confirmationInviteMockCopy.confirmation as boolean,
      confirmationInviteMockCopy.entriesConfirmed as number,
      confirmationInviteMockCopy.message as string
    );

    const controls = fixture.componentInstance.confirmationForm.controls;
    expect(controls['confirmation'].value)
      .withContext('Confirmation control should be filled')
      .toBe(confirmationInviteMockCopy.confirmation?.toString());

    expect(controls['entriesConfirmed'].value)
      .withContext('EntriesConfirmed control should be filled')
      .toBe(confirmationInviteMockCopy.entriesConfirmed?.toString());

    expect(controls['message'].value)
      .withContext('Message control should be filled')
      .toEqual(confirmationInviteMockCopy.message);
  });

  it('Expect save button to trigger saveInformation', () => {
    fixture.componentRef.setInput('inviteValue', {
      ...sweetXvUserInviteMockCopy,
      confirmation: null,
      entriesConfirmed: null,
      message: null,
    });
    fixture.componentRef.setInput('deadlineMet', false);
    fixture.detectChanges();

    spyOn(fixture.componentInstance, 'saveInformation');
    const saveButton = fixture.debugElement.query(By.css('.button button'));
    saveButton.nativeElement.click();

    expect(fixture.componentInstance.saveInformation)
      .withContext('SaveUser method should have been called')
      .toHaveBeenCalled();
  });

  it('Display entriesConfirmed error message when field is blank', () => {
    fixture.componentRef.setInput('inviteValue', {
      ...sweetXvUserInviteMockCopy,
      confirmation: null,
      entriesConfirmed: null,
      message: null,
    });

    fixture.componentRef.setInput('deadlineMet', false);
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(By.css('.button button'));
    saveButton.nativeElement.click();

    fixture.detectChanges();

    const entriesConfirmedErrorSpan = fixture.debugElement.query(
      By.css('.invalid-feedback')
    );

    expect(entriesConfirmedErrorSpan.nativeElement.innerHTML)
      .withContext('EntriesConfirmed span for error should be filled')
      .toContain('El número de pases es requerido');
  });

  it("Shouldn't display entriesConfirmed error message when field is filled and should display confirmationModal", () => {
    fixture.componentRef.setInput('inviteValue', {
      ...sweetXvUserInviteMockCopy,
      confirmation: null,
      entriesConfirmed: null,
      message: null,
    });

    fixture.componentRef.setInput('deadlineMet', false);
    fixture.detectChanges();

    updateFormUsingEvent(
      confirmationInviteMockCopy.confirmation as boolean,
      confirmationInviteMockCopy.entriesConfirmed as number,
      confirmationInviteMockCopy.message as string
    );

    const saveButton = fixture.debugElement.query(By.css('button'));
    saveButton.nativeElement.click();

    fixture.detectChanges();

    const confirmedModal = fixture.debugElement.query(
      By.css('.confirmedModal')
    );

    expect(confirmedModal)
      .withContext('ConfirmedModal to be displayed when form is filled')
      .not.toBeNull();
  });

  it('Should display warning message when deadline is met', () => {
    fixture.componentRef.setInput('inviteValue', {
      ...sweetXvUserInviteMockCopy,
      confirmation: null,
      entriesConfirmed: null,
      message: null,
    });
    fixture.detectChanges();

    fixture.componentRef.setInput('deadlineMet', true);
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('.form'));

    const warningMessage = form.query(By.css('.question span'));

    expect(warningMessage.nativeElement.textContent)
      .withContext('Warning message should displayed when deadline is met')
      .toContain('Este formulario no acepta mas respuestas');
  });

  it('Should display confirmationModal with confirmation message when invite is confirmed', () => {
    fixture.componentRef.setInput('inviteValue', {
      ...sweetXvUserInviteMockCopy,
    });

    fixture.componentRef.setInput('deadlineMet', false);
    fixture.detectChanges();

    const confirmedModal = fixture.debugElement.query(
      By.css('.confirmedModal')
    );
    const cardTitle = confirmedModal.query(By.css('h3'));
    const confirmedParagraph = confirmedModal.query(By.css('span'));
    const closePageMessage = confirmedModal.query(By.css('p'));

    expect(confirmedModal)
      .withContext('ConfirmedModal to be displayed when form is filled')
      .not.toBeNull();

    expect(cardTitle.nativeElement.textContent)
      .withContext('Card title should be displayed')
      .toContain(saveTheDateUserInviteMockCopy.family);

    expect(confirmedParagraph.nativeElement.textContent)
      .withContext('Confirmation message should be displayed')
      .toContain('Su asistencia ha sido confirmada');

    expect(closePageMessage.nativeElement.textContent)
      .withContext('Close page message should be displayed')
      .toContain('Puede cerrar la página');
  });

  it('Should display confirmationModal with confirmation message when invite is canceled', () => {
    fixture.componentRef.setInput('inviteValue', {
      ...sweetXvUserInviteMockCopy,
      confirmation: false,
    });

    fixture.componentRef.setInput('deadlineMet', false);
    fixture.detectChanges();

    const confirmedModal = fixture.debugElement.query(
      By.css('.confirmedModal')
    );
    const cardTitle = confirmedModal.query(By.css('h3'));
    const confirmedParagraph = confirmedModal.query(By.css('span'));
    const closePageMessage = confirmedModal.query(By.css('p'));

    expect(confirmedModal)
      .withContext('ConfirmedModal to be displayed when form is filled')
      .not.toBeNull();

    expect(cardTitle.nativeElement.textContent)
      .withContext('Card title should be displayed')
      .toContain(saveTheDateUserInviteMockCopy.family);

    expect(confirmedParagraph.nativeElement.textContent)
      .withContext('Confirmation message should be displayed')
      .toContain('Su asistencia ha sido cancelada');

    expect(closePageMessage.nativeElement.textContent)
      .withContext('Close page message should be displayed')
      .toContain('Muchas gracias por su tiempo.');
  });

  it('Expect save button to call sendConfirmation from InvitesService', () => {
    fixture.componentRef.setInput('inviteValue', {
      ...sweetXvUserInviteMockCopy,
      confirmation: null,
      entriesConfirmed: null,
      message: null,
    });
    fixture.componentRef.setInput('deadlineMet', false);
    fixture.detectChanges();

    updateFormUsingEvent(
      confirmationInviteMockCopy.confirmation,
      confirmationInviteMockCopy.entriesConfirmed,
      confirmationInviteMockCopy.message as string
    );

    const saveButton = fixture.debugElement.query(By.css('.button button'));
    saveButton.nativeElement.click();

    expect(invitesServiceSpy.sendConfirmation)
      .withContext('SaveUser method should have been called')
      .toHaveBeenCalled();
  });
});
