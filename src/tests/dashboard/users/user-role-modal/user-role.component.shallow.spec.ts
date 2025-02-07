import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from 'src/app/core/services/roles.service';
import { UserRoleComponent } from 'src/app/dashboard/users/user-role-modal/user-role.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { roleMock } from 'src/tests/mocks/mocks';

const roleMockCopy = deepCopy(roleMock);

describe('User Role Component (Shallow Test)', () => {
  let fixture: ComponentFixture<UserRoleComponent>;

  const updateFormUsingEvent = (name: string, isActive: boolean) => {
    const nameInput = fixture.debugElement.query(By.css('#name'));
    const roleIsActiveInput = fixture.debugElement.query(
      By.css('#roleIsActive')
    );

    nameInput.nativeElement.value = name;
    nameInput.nativeElement.dispatchEvent(new Event('input'));

    roleIsActiveInput.nativeElement.checked = isActive;
    roleIsActiveInput.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const rolesSpy = jasmine.createSpyObj('RolesService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [UserRoleComponent],
      imports: [ReactiveFormsModule, ValidationPipe, ValidationErrorPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: RolesService, useValue: rolesSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleComponent);
    fixture.detectChanges();
  });

  it('created a form with name, roleIsActive, save button, cancel button', () => {
    const nameInput = fixture.debugElement.query(By.css('#name'));
    const roleIsActiveInput = fixture.debugElement.query(
      By.css('#roleIsActive')
    );

    const buttons = fixture.debugElement.queryAll(
      By.css('.modal-footer button')
    );
    const cancelButton = buttons[0];
    const saveButton = buttons[1];

    expect(nameInput)
      .withContext("NameInput input shouldn't be null")
      .not.toBeNull();
    expect(roleIsActiveInput)
      .withContext("UserIsActive input shouldn't be null")
      .not.toBeNull();
    expect(saveButton)
      .withContext("Save button shouldn't be null")
      .not.toBeNull();
    expect(cancelButton)
      .withContext("Cancel button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(roleMockCopy.name, roleMockCopy.isActive);

    const controls = fixture.componentInstance.createRoleForm.controls;
    expect(controls['name'].value)
      .withContext('Name control should be filled')
      .toBe(roleMockCopy.name);

    expect(controls['isActive'].value)
      .withContext('IsActive control should be filled')
      .toBe(roleMockCopy.isActive);
  });

  it('Expect save button to trigger saveRole', () => {
    spyOn(fixture.componentInstance, 'saveRole');
    const buttons = fixture.debugElement.queryAll(
      By.css('.modal-footer button')
    );
    const saveButton = buttons[1];
    saveButton.nativeElement.click();

    expect(fixture.componentInstance.saveRole)
      .withContext('saveRole method should have been called')
      .toHaveBeenCalled();
  });

  it('Display name error message when fields are blank', () => {
    updateFormUsingEvent('', roleMockCopy.isActive);

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const nameErrorSpan = errorSpans[0];

    expect(nameErrorSpan.nativeElement.innerHTML)
      .withContext('Name span for error should be filled')
      .toContain('El nombre del rol es requerido');
  });

  it("Shouldn't display name error message when fields are filled", () => {
    updateFormUsingEvent(roleMockCopy.name, roleMockCopy.isActive);
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    expect(errorSpans.length)
      .withContext('There should be no error messages')
      .toBe(0);
  });
});
