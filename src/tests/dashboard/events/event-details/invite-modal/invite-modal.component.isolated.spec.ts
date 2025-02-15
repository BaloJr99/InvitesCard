import { FormBuilder } from '@angular/forms';
import { InviteModalComponent } from 'src/app/dashboard/events/event-details/invite-modal/invite-modal.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { newInviteMock } from 'src/tests/mocks/mocks';

const newInviteMockCopy = deepCopy(newInviteMock);

describe('Invite Modal Component (Isolated Test)', () => {
  let component: InviteModalComponent;

  const updateForm = (
    family: string,
    entriesNumber: number,
    phoneNumber: string,
    inviteGroupId: string,
    kidsAllowed: boolean
  ) => {
    component.createInviteForm.controls['family'].setValue(family);
    component.createInviteForm.controls['entriesNumber'].setValue(
      entriesNumber
    );
    component.createInviteForm.controls['phoneNumber'].setValue(phoneNumber);
    component.createInviteForm.controls['inviteGroupId'].setValue(
      inviteGroupId
    );
    component.createInviteForm.controls['kidsAllowed'].setValue(kidsAllowed);
  };

  beforeEach(() => {
    const inviteModalSpy = jasmine.createSpyObj('InviteModalComponent', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    component = new InviteModalComponent(
      inviteModalSpy,
      new FormBuilder(),
      toastrSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render initial values', () => {
    expect(component.createInviteForm)
      .withContext('should have createInviteForm to be defined')
      .toBeDefined();

    expect(component.showNewGroupForm)
      .withContext('should have showNewGroupForm to be false')
      .toBeFalse();

    expect(component.groupSelected)
      .withContext('should have groupSelected to be undefined')
      .toBeUndefined();
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('', 0, '', '', false);
    expect(component.createInviteForm.invalid)
      .withContext('Form should be invalid when all fields are not valid')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(
      newInviteMockCopy.family,
      newInviteMockCopy.entriesNumber,
      newInviteMockCopy.phoneNumber,
      newInviteMockCopy.inviteGroupId,
      newInviteMockCopy.kidsAllowed
    );
    expect(component.createInviteForm.valid)
      .withContext('Form should be valid')
      .toBeTruthy();
  });
});
