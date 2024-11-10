import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { InviteGroupComponent } from 'src/app/dashboard/events/event-details/invite-modal/invite-group-modal/invite-group.component';
import {
  fullInvitesGroupsMock,
  messageResponseMock,
} from 'src/tests/mocks/mocks';

describe('Invite Group Component (Integrated Test)', () => {
  let fixture: ComponentFixture<InviteGroupComponent>;
  let inviteGroupsServiceSpy: jasmine.SpyObj<InviteGroupsService>;

  const updateFormUsingEvent = (inviteGroup: string) => {
    const inviteGroupInput = fixture.debugElement.query(By.css('#inviteGroup'));

    inviteGroupInput.nativeElement.value = inviteGroup;
    inviteGroupInput.nativeElement.dispatchEvent(new Event('input'));
  };

  beforeEach(waitForAsync(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['setLoading']);
    const inviteGroupsSpy = jasmine.createSpyObj('InviteGroupsService', [
      'createInviteGroup',
      'updateInviteGroup',
    ]);

    TestBed.configureTestingModule({
      declarations: [InviteGroupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: LoaderService, useValue: loaderSpy },
        { provide: InviteGroupsService, useValue: inviteGroupsSpy },
      ],
    }).compileComponents();

    inviteGroupsServiceSpy = TestBed.inject(
      InviteGroupsService
    ) as jasmine.SpyObj<InviteGroupsService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteGroupComponent);
    fixture.detectChanges();
  });

  it('inviteGroupsService createInviteGroup() should called', () => {
    inviteGroupsServiceSpy.createInviteGroup.and.returnValue(
      of(messageResponseMock)
    );

    updateFormUsingEvent(fullInvitesGroupsMock.inviteGroup);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[1];
    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(inviteGroupsServiceSpy.createInviteGroup)
      .withContext(
        "createInviteGroup method from InviteGroupService should've been called"
      )
      .toHaveBeenCalled();
  });

  it('inviteGroupsService updateInviteGroup() should called', () => {
    fixture.componentInstance.createInviteGroupForm.patchValue({
      id: fullInvitesGroupsMock.id,
    });

    inviteGroupsServiceSpy.updateInviteGroup.and.returnValue(
      of(messageResponseMock)
    );

    updateFormUsingEvent(fullInvitesGroupsMock.inviteGroup);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[1];
    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(inviteGroupsServiceSpy.updateInviteGroup)
      .withContext(
        "updateInviteGroup method from InviteGroupService should've been called"
      )
      .toHaveBeenCalled();
  });
});
