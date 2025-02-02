import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { InvitesService } from 'src/app/core/services/invites.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { InviteModalComponent } from 'src/app/dashboard/events/event-details/invite-modal/invite-modal.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  fullInvitesGroupsMock,
  messageResponseMock,
  newInviteMock,
} from 'src/tests/mocks/mocks';

const fullInvitesGroupsMockCopy = deepCopy(fullInvitesGroupsMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);
const newInviteMockCopy = deepCopy(newInviteMock);

describe('Invite Modal Component (Shallow Test)', () => {
  let fixture: ComponentFixture<InviteModalComponent>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;

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
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['setLoading']);
    const invitesSpy = jasmine.createSpyObj('InvitesService', [
      'createInvite',
      'updateInvite',
    ]);

    TestBed.configureTestingModule({
      declarations: [InviteModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: LoaderService, useValue: loaderSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: InvitesService, useValue: invitesSpy },
      ],
    }).compileComponents();

    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteModalComponent);
    // We need to populate the inviteGroupId select with options
    fixture.componentInstance.inviteGroups = [fullInvitesGroupsMockCopy];
    fixture.componentInstance.eventId = newInviteMockCopy.eventId;
    fixture.detectChanges();
  });

  it('inviteService createInvite() should called', () => {
    invitesServiceSpy.createInvite.and.returnValue(of(messageResponseMockCopy));

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
    fixture.detectChanges();

    expect(invitesServiceSpy.createInvite)
      .withContext(
        "createInvite method from InvitesService should've been called"
      )
      .toHaveBeenCalled();
  });

  it('invitesService updateInvite() should called', () => {
    fixture.componentInstance.createInviteForm.patchValue({
      id: newInviteMockCopy.id,
    });

    invitesServiceSpy.updateInvite.and.returnValue(of(messageResponseMockCopy));

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
    fixture.detectChanges();

    expect(invitesServiceSpy.updateInvite)
      .withContext(
        "updateInvite method from InvitesService should've been called"
      )
      .toHaveBeenCalled();
  });
});
