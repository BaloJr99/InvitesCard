import { FormBuilder } from '@angular/forms';
import { InviteGroupFormComponent } from 'src/app/dashboard/events/event-details/invite-modal/invite-group-form/invite-group-form.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { fullInvitesGroupsMock } from 'src/tests/mocks/mocks';

const fullInvitesGroupsMockCopy = deepCopy(fullInvitesGroupsMock);

describe('Invite Group Form Component (Isolated Test)', () => {
  let component: InviteGroupFormComponent;

  const updateForm = (inviteGroup: string) => {
    component.createInviteGroupForm.controls['inviteGroup'].setValue(
      inviteGroup
    );
  };

  beforeEach(() => {
    const inviteGroupSpy = jasmine.createSpyObj('InviteGroupFormComponent', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    component = new InviteGroupFormComponent(
      inviteGroupSpy,
      new FormBuilder(),
      toastrSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render initial values', () => {
    expect(component.createInviteGroupForm)
      .withContext('should have createInviteGroupForm to be defined')
      .toBeDefined();
  });

  it('form value should be invalid if one input is invalid', () => {
    updateForm('');
    expect(component.createInviteGroupForm.invalid)
      .withContext('Form should be invalid when all fields are not valid')
      .toBeTrue();
  });

  it('form should be valid when fields are filled', () => {
    updateForm(fullInvitesGroupsMockCopy.inviteGroup);
    expect(component.createInviteGroupForm.valid)
      .withContext('Form should be valid')
      .toBeTruthy();
  });

  it('should have inviteGroup in the createInviteGroupForm', () => {
    const inviteGroup = component.createInviteGroupForm.controls['inviteGroup'];
    expect(inviteGroup.valid)
      .withContext('inviteGroup should be invalid')
      .toBeFalsy();
    expect(inviteGroup.errors?.['required'])
      .withContext('inviteGroup should be required')
      .toBeTruthy();
  });
});
