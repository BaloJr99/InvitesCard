import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { InviteGroupComponent } from 'src/app/dashboard/events/event-details/invite-modal/invite-group-modal/invite-group.component';
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
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const inviteGroupsSpy = jasmine.createSpyObj('InviteGroupsService', ['']);

    TestBed.configureTestingModule({
      declarations: [InviteGroupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: LoaderService, useValue: loaderSpy },
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

  it('Expect inviteGroup change to trigger checkInviteGroup', () => {
    spyOn(fixture.componentInstance, 'checkInviteGroup');

    const inviteGroup = fixture.debugElement.query(By.css('#inviteGroup'));
    inviteGroup.nativeElement.dispatchEvent(new Event('keyup'));

    expect(fixture.componentInstance.checkInviteGroup)
      .withContext('checkInviteGroup method should have been called')
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

    expect(fixture.componentInstance.displayMessage['inviteGroup'])
      .withContext('Invite Group displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['inviteGroup'])
      .withContext('Should displayMessage error for inviteGroup')
      .toContain('El nombre del grupo es requerido');
  });

  it("Shouldn't display inviteGroup error message when field is filled", () => {
    updateFormUsingEvent(fullInvitesGroupsMockCopy.inviteGroup);
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );
    const inviteGroupErrorSpan = errorSpans[0];

    expect(inviteGroupErrorSpan.nativeElement.innerHTML)
      .withContext('Invite Group span for error should be filled')
      .not.toContain('El nombre del grupo es requerido');

    expect(fixture.componentInstance.displayMessage['inviteGroup'])
      .withContext('Invite Group displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['inviteGroup'])
      .withContext('Should displayMessage error for inviteGroup')
      .not.toContain('El nombre del grupo es requerido');
  });

  it('Should display inviteGroup error message when controlIsValid = false', () => {
    fixture.componentInstance.createInviteGroupForm.controls[
      'controlIsValid'
    ].patchValue(false);
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );
    const inviteGroupErrorSpan = errorSpans[1];

    expect(inviteGroupErrorSpan.nativeElement.innerHTML)
      .withContext('Invite Group span for error should be filled')
      .toContain('Ya existe un grupo con este nombre');

    expect(fixture.componentInstance.displayMessage['inviteGroup'])
      .withContext('Invite Group displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['controlValueDuplicated'])
      .withContext('Should displayMessage error for inviteGroup')
      .toContain('Ya existe un grupo con este nombre');
  });
});
