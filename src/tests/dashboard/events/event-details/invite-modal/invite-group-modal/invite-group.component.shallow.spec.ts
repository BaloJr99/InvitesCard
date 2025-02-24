import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { InviteGroupComponent } from 'src/app/dashboard/events/event-details/invite-modal/invite-group-modal/invite-group.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { fullInvitesGroupsMock } from 'src/tests/mocks/mocks';

const fullInvitesGroupsMockCopy = deepCopy(fullInvitesGroupsMock);

describe('Invite Group Component (Shallow Test)', () => {
  let fixture: ComponentFixture<InviteGroupComponent>;

  const updateFormUsingEvent = (username: string) => {
    const inviteGroupInput = fixture.debugElement.query(By.css('#inviteGroup'));

    inviteGroupInput.nativeElement.value = username;
    inviteGroupInput.nativeElement.dispatchEvent(new Event('input'));
  };

  beforeEach(waitForAsync(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const inviteGroupsSpy = jasmine.createSpyObj('InviteGroupsService', ['']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ValidationPipe,
        ValidationErrorPipe,
        InviteGroupComponent,
      ],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: InviteGroupsService, useValue: inviteGroupsSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteGroupComponent);
    fixture.detectChanges();
  });

  it('created a form with inviteGroup, save button, cancel button', () => {
    const inviteGroup = fixture.debugElement.query(By.css('#inviteGroup'));
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[0];
    const cancelButton = buttons[1];

    expect(inviteGroup)
      .withContext("InviteGroup input shouldn't be null")
      .not.toBeNull();
    expect(saveButton)
      .withContext("Save Button shouldn't be null")
      .not.toBeNull();
    expect(cancelButton)
      .withContext("Cancel Button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(fullInvitesGroupsMockCopy.inviteGroup);
    expect(
      fixture.componentInstance.createInviteGroupForm.controls['inviteGroup']
        .value
    )
      .withContext('InviteGroup control should be filled when input changes')
      .toBe(fullInvitesGroupsMockCopy.inviteGroup);
  });

  it('Expect save button to trigger saveInviteGroup', () => {
    spyOn(fixture.componentInstance, 'saveInviteGroup');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[1];
    saveButton.nativeElement.click();

    expect(fixture.componentInstance.saveInviteGroup)
      .withContext('saveInviteGroup method should have been called')
      .toHaveBeenCalled();
  });

  it('Expect cancel button to trigger toggleIsCreatingNewFormGroup', () => {
    spyOn(fixture.componentInstance, 'toggleIsCreatingNewFormGroup');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const cancelButton = buttons[0];
    cancelButton.nativeElement.click();

    expect(fixture.componentInstance.toggleIsCreatingNewFormGroup)
      .withContext(
        'toggleIsCreatingNewFormGroup method should have been called'
      )
      .toHaveBeenCalled();
  });

  it('Expect save button to trigger inviteGroupDuplicated', () => {
    spyOn(fixture.componentInstance, 'inviteGroupDuplicated').and.returnValue(
      of(false)
    );

    updateFormUsingEvent(fullInvitesGroupsMockCopy.inviteGroup);

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[1];
    saveButton.nativeElement.click();

    expect(fixture.componentInstance.inviteGroupDuplicated)
      .withContext('inviteGroupDuplicated method should have been called')
      .toHaveBeenCalled();
  });

  it('Display inviteGroup error message when field is blank', () => {
    updateFormUsingEvent('');
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );
    const inviteGroupErrorSpan = errorSpans[0];

    expect(inviteGroupErrorSpan.nativeElement.innerHTML)
      .withContext('Invite Group span for error should be filled')
      .toContain('El nombre del grupo es requerido');
  });

  it("Shouldn't display inviteGroup error message when field is filled", () => {
    updateFormUsingEvent(fullInvitesGroupsMockCopy.inviteGroup);
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    expect(errorSpans.length)
      .withContext('Should not display any error messages')
      .toBe(0);
  });

  it('Should display inviteGroup error message when controlIsValid = false', () => {
    fixture.componentInstance.createInviteGroupForm.controls[
      'controlIsValid'
    ].patchValue(false);
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );
    const inviteGroupErrorSpan = errorSpans[0];

    expect(inviteGroupErrorSpan.nativeElement.innerHTML)
      .withContext('Invite Group span for error should be filled')
      .toContain('Ya existe un registro con este nombre');
  });
});
