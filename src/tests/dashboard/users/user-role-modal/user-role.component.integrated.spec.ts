import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { UserRoleComponent } from 'src/app/dashboard/users/user-role-modal/user-role.component';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { deepCopy } from 'src/app/shared/utils/tools';
import { messageResponseMock, roleMock } from 'src/tests/mocks/mocks';

const messageResponseMockCopy = deepCopy(messageResponseMock);
const roleMockCopy = deepCopy(roleMock);

describe('User Role Component (Integrated Test)', () => {
  let fixture: ComponentFixture<UserRoleComponent>;
  let rolesServiceSpy: jasmine.SpyObj<RolesService>;

  const updateFormUsingEvent = (
    id: string,
    name: string,
    isActive: boolean
  ) => {
    fixture.componentInstance.createRoleForm.patchValue({
      id,
    });

    const nameInput = fixture.debugElement.query(By.css('#name'));
    const roleIsActiveInput = fixture.debugElement.query(
      By.css('#roleIsActive')
    );

    nameInput.nativeElement.value = name;
    nameInput.nativeElement.dispatchEvent(new Event('input'));

    roleIsActiveInput.nativeElement.checked = isActive;
    roleIsActiveInput.nativeElement.dispatchEvent(new Event('change'));
  };

  beforeEach(waitForAsync(() => {
    const rolesSpy = jasmine.createSpyObj('RolesService', [
      'createRole',
      'updateRole',
      'checkRoleName',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [UserRoleComponent],
      imports: [ReactiveFormsModule, ValidationPipe, ValidationErrorPipe],
      providers: [
        { provide: RolesService, useValue: rolesSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    rolesServiceSpy = TestBed.inject(
      RolesService
    ) as jasmine.SpyObj<RolesService>;
  }));

  beforeEach(() => {
    rolesServiceSpy.createRole.and.returnValue(of(messageResponseMockCopy));
    rolesServiceSpy.updateRole.and.returnValue(of(messageResponseMockCopy));
    rolesServiceSpy.checkRoleName.and.returnValue(of(false));

    fixture = TestBed.createComponent(UserRoleComponent);
    fixture.detectChanges();
  });

  it('should call createRole()', () => {
    updateFormUsingEvent('', roleMockCopy.name, roleMockCopy.isActive);

    const buttons = fixture.debugElement.queryAll(
      By.css('.modal-footer button')
    );
    const saveButton = buttons[1];
    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(rolesServiceSpy.createRole)
      .withContext("createRole method from RolesService should've been called")
      .toHaveBeenCalled();
  });

  it('should call updateRole()', () => {
    updateFormUsingEvent(
      roleMockCopy.id,
      roleMockCopy.name,
      roleMockCopy.isActive
    );

    const buttons = fixture.debugElement.queryAll(
      By.css('.modal-footer button')
    );
    const saveButton = buttons[1];
    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(rolesServiceSpy.updateRole)
      .withContext("updateRole method from RolesService should've been called")
      .toHaveBeenCalled();
  });
});
