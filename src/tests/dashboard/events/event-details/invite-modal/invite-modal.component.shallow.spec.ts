import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { InvitesService } from 'src/app/core/services/invites.service';
import { InviteModalComponent } from 'src/app/dashboard/events/event-details/invite-modal/invite-modal.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { newInviteMock, fullInvitesGroupsMock } from 'src/tests/mocks/mocks';

const fullInvitesGroupsMockCopy = deepCopy(fullInvitesGroupsMock);
const newInviteMockCopy = deepCopy(newInviteMock);

describe('Invite Modal Component (Shallow Test)', () => {
  let fixture: ComponentFixture<InviteModalComponent>;

  const updateFormUsingEvent = (
    family: string,
    entriesNumber: number,
    phoneNumber: string,
    inviteGroupId: string,
    kidsAllowed: boolean
  ) => {
    const familyInput = fixture.debugElement.query(By.css('#family'));
    const entriesNumberInput = fixture.debugElement.query(
      By.css('#entriesNumber')
    );
    const phoneNumberInput = fixture.debugElement.query(By.css('#phoneNumber'));
    const inviteGroupIdSelect = fixture.debugElement.query(
      By.css('#inviteGroupId')
    );
    const kidsAllowedCheckbox = fixture.debugElement.query(
      By.css('#kidsAllowed')
    );

    familyInput.nativeElement.value = family;
    familyInput.nativeElement.dispatchEvent(new Event('input'));

    entriesNumberInput.nativeElement.value = entriesNumber;
    entriesNumberInput.nativeElement.dispatchEvent(new Event('input'));

    phoneNumberInput.nativeElement.value = phoneNumber;
    phoneNumberInput.nativeElement.dispatchEvent(new Event('input'));

    inviteGroupIdSelect.nativeElement.value = inviteGroupId;
    inviteGroupIdSelect.nativeElement.dispatchEvent(new Event('change'));

    kidsAllowedCheckbox.nativeElement.value = kidsAllowed;
    kidsAllowedCheckbox.nativeElement.dispatchEvent(new Event('checkbox'));
  };

  beforeEach(waitForAsync(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const invitesSpy = jasmine.createSpyObj('InviteGroupsService', ['']);

    TestBed.configureTestingModule({
      declarations: [InviteModalComponent],
      imports: [ReactiveFormsModule, ValidationPipe, ValidationErrorPipe],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: InvitesService, useValue: invitesSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteModalComponent);
    // We need to populate the inviteGroupId select with options
    fixture.componentRef.setInput('inviteGroupsValue', [
      fullInvitesGroupsMockCopy,
    ]);
    fixture.detectChanges();
  });

  it('created a form with inputs (family, inviteGroupId, entriesNumber, phoneNumber, kidsAllowed) and buttons (save, cancel)', () => {
    const family = fixture.debugElement.query(By.css('#family'));
    const inviteGroupId = fixture.debugElement.query(By.css('#inviteGroupId'));
    const entriesNumber = fixture.debugElement.query(By.css('#entriesNumber'));
    const phoneNumber = fixture.debugElement.query(By.css('#phoneNumber'));
    const kidsAllowed = fixture.debugElement.query(By.css('#kidsAllowed'));

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[0];
    const cancelButton = buttons[1];

    expect(family).withContext("Family input shouldn't be null").not.toBeNull();
    expect(inviteGroupId)
      .withContext("InviteGroupId select shouldn't be null")
      .not.toBeNull();
    expect(entriesNumber)
      .withContext("EntriesNumber input shouldn't be null")
      .not.toBeNull();
    expect(phoneNumber)
      .withContext("PhoneNumber input shouldn't be null")
      .not.toBeNull();
    expect(kidsAllowed)
      .withContext("KidsAllowed checkbox shouldn't be null")
      .not.toBeNull();
    expect(saveButton)
      .withContext("Save Button shouldn't be null")
      .not.toBeNull();
    expect(cancelButton)
      .withContext("Cancel Button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(
      newInviteMockCopy.family,
      newInviteMockCopy.entriesNumber,
      newInviteMockCopy.phoneNumber,
      newInviteMockCopy.inviteGroupId,
      newInviteMockCopy.kidsAllowed
    );
    expect(fixture.componentInstance.createInviteForm.controls['family'].value)
      .withContext('Family control should be filled when input changes')
      .toBe(newInviteMockCopy.family);

    expect(
      fixture.componentInstance.createInviteForm.controls['entriesNumber'].value
    )
      .withContext('EntriesNumber control should be filled when input changes')
      .toBe(newInviteMockCopy.entriesNumber);

    expect(
      fixture.componentInstance.createInviteForm.controls['phoneNumber'].value
    )
      .withContext('PhoneNumber control should be filled when input changes')
      .toBe(newInviteMockCopy.phoneNumber);

    expect(
      fixture.componentInstance.createInviteForm.controls['inviteGroupId'].value
    )
      .withContext('InviteGroupId control should be filled when input changes')
      .toBe(newInviteMockCopy.inviteGroupId);

    expect(
      fixture.componentInstance.createInviteForm.controls['kidsAllowed'].value
    )
      .withContext('KidsAllowed control should be filled when input changes')
      .toBe(newInviteMockCopy.kidsAllowed);
  });

  it('Expect save button to trigger saveInvite', () => {
    spyOn(fixture.componentInstance, 'saveInvite');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[3];
    saveButton.nativeElement.click();

    expect(fixture.componentInstance.saveInvite).toHaveBeenCalled();
  });

  it('Expect save button to trigger createInvite', () => {
    spyOn(fixture.componentInstance, 'createInvite');

    updateFormUsingEvent(
      newInviteMockCopy.family,
      newInviteMockCopy.entriesNumber,
      newInviteMockCopy.phoneNumber,
      newInviteMockCopy.inviteGroupId,
      newInviteMockCopy.kidsAllowed
    );
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[4];
    saveButton.nativeElement.click();

    expect(fixture.componentInstance.createInvite).toHaveBeenCalled();
  });

  it('Expect save button to trigger updateInvite', () => {
    spyOn(fixture.componentInstance, 'updateInvite');

    fixture.componentInstance.createInviteForm.patchValue({
      id: newInviteMockCopy.id,
    });

    updateFormUsingEvent(
      newInviteMockCopy.family,
      newInviteMockCopy.entriesNumber,
      newInviteMockCopy.phoneNumber,
      newInviteMockCopy.inviteGroupId,
      newInviteMockCopy.kidsAllowed
    );
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[4];
    saveButton.nativeElement.click();

    expect(fixture.componentInstance.updateInvite).toHaveBeenCalled();
  });
});
