import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from 'src/app/core/services/roles.service';
import { UserRoleComponent } from 'src/app/dashboard/users/user-role-modal/user-role.component';
import { roleMock } from 'src/tests/mocks/mocks';

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
      imports: [ReactiveFormsModule],
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
    updateFormUsingEvent(roleMock.name, roleMock.isActive);

    const controls = fixture.componentInstance.createRoleForm.controls;
    expect(controls['name'].value)
      .withContext('Name control should be filled')
      .toBe(roleMock.name);

    expect(controls['isActive'].value)
      .withContext('IsActive control should be filled')
      .toBe(roleMock.isActive);
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
    updateFormUsingEvent('', roleMock.isActive);

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const nameErrorSpan = errorSpans[0];

    expect(nameErrorSpan.nativeElement.innerHTML)
      .withContext('Name span for error should be filled')
      .toContain('El nombre del rol es requerido');

    expect(fixture.componentInstance.displayMessage['name'])
      .withContext('Name displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['name'])
      .withContext('Should displayMessage error for name')
      .toContain('El nombre del rol es requerido');
  });

  it("Shouldn't display name error message when fields are filled", () => {
    updateFormUsingEvent(roleMock.name, roleMock.isActive);
    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const nameErrorSpan = errorSpans[0];

    expect(nameErrorSpan.nativeElement.innerHTML)
      .withContext("Name span for error shouldn't be filled")
      .not.toContain('El nombre del rol es requerido');

    expect(fixture.componentInstance.displayMessage['name'])
      .withContext('Name displayMessage should exist')
      .toBeDefined();

    expect(fixture.componentInstance.displayMessage['name'])
      .withContext("Shouldn't displayMessage error for name")
      .not.toContain('El nombre del rol es requerido');
  });
});
