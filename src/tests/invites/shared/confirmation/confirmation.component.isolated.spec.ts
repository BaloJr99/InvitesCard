import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IUserInvite } from 'src/app/core/models/invites';
import { ConfirmationComponent } from 'src/app/invites/shared/confirmation/confirmation.component';
import { confirmationInviteMock } from 'src/tests/mocks/mocks';

describe('Confirmation Component (Isolated Test)', () => {
  let component: ConfirmationComponent;

  const updateForm = (
    confirmation: boolean | null,
    entriesConfirmed: number | null,
    message: string | null
  ) => {
    if (confirmation === null) {
      component.confirmationForm.controls['confirmation'].setValue(false);
    } else {
      component.confirmationForm.controls['confirmation'].setValue(
        confirmation
      );
    }

    if (entriesConfirmed) {
      component.confirmationForm.controls['entriesConfirmed'].setValue(
        entriesConfirmed
      );
    } else {
      component.confirmationForm.controls['entriesConfirmed'].setValue('');
    }

    component.confirmationForm.controls['message'].setValue(message);
  };

  beforeEach(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const socketSpy = jasmine.createSpyObj('SocketService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);

    component = new ConfirmationComponent(
      new FormBuilder(),
      invitesSpy,
      socketSpy,
      loaderSpy,
      new ActivatedRoute()
    );
  });

  it('should create', () => {
    expect(component)
      .withContext('ConfirmationComponent should be created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.invite)
      .withContext('Invite should be empty')
      .toEqual({} as IUserInvite);
    expect(component.blockConfirmationForm)
      .withContext('Block confirmation form should be false')
      .toBeFalse();
    expect(component.confirmationForm)
      .withContext('Confirmation form should be defined')
      .toBeDefined();
    expect(component.displayMessage)
      .withContext('Display message should be empty')
      .toEqual({});
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm(null, null, '');
    expect(component.confirmationForm.invalid)
      .withContext('Form should be invalid when fields are empty')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(
      confirmationInviteMock.confirmation,
      confirmationInviteMock.entriesConfirmed,
      confirmationInviteMock.message
    );
    expect(component.confirmationForm.valid)
      .withContext('Form should be valid')
      .toBeTrue();
  });

  it('should have confirmation, entriesConfirmed, message in the confirmationForm', () => {
    const controls = component.confirmationForm.controls;

    expect(controls['confirmation'].valid)
      .withContext('Confirmation should be valid')
      .toBeTrue();

    expect(controls['entriesConfirmed'].valid)
      .withContext('EntriesConfirmed should be invalid')
      .toBeFalse();
    expect(controls['entriesConfirmed'].errors?.['required'])
      .withContext('EntriesConfirmed should be required')
      .toBeTrue();

    expect(controls['message'].valid)
      .withContext('message should be valid')
      .toBeTrue();
  });
});
