import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import { messageResponseMock, roleMock } from 'src/tests/mocks/mocks';

const messageResponseMockCopy = deepCopy(messageResponseMock);
const roleMockCopy = deepCopy(roleMock);

describe('Roles Service', () => {
  let rolesService: RolesService;
  let rolesServiceSpy: jasmine.SpyObj<RolesService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RolesService', [
      'getAllRoles',
      'getRoleById',
      'createRole',
      'updateRole',
      'deleteRole',
      'checkRoleName',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: RolesService, useValue: spy }],
    });

    rolesServiceSpy = TestBed.inject(
      RolesService
    ) as jasmine.SpyObj<RolesService>;
  });

  it('should be created', () => {
    rolesService = TestBed.inject(RolesService);
    expect(rolesService)
      .withContext('Expected Roles Service to have been created')
      .toBeTruthy();
  });

  it('should call getAllRoles', () => {
    rolesServiceSpy.getAllRoles.and.returnValue(of([roleMockCopy]));

    rolesServiceSpy.getAllRoles().subscribe((response) => {
      expect(response).toEqual([roleMockCopy]);
    });

    expect(rolesServiceSpy.getAllRoles)
      .withContext('Expected getAllRoles to have been called')
      .toHaveBeenCalledOnceWith();
  });

  it('should call getRoleById', () => {
    rolesServiceSpy.getRoleById.and.returnValue(of(roleMockCopy));

    rolesServiceSpy.getRoleById(roleMockCopy.id).subscribe((response) => {
      expect(response).toEqual(roleMockCopy);
    });

    expect(rolesServiceSpy.getRoleById)
      .withContext('Expected getRoleById to have been called')
      .toHaveBeenCalledOnceWith(roleMockCopy.id);
  });

  it('should call createRole', () => {
    rolesServiceSpy.createRole.and.returnValue(of(messageResponseMockCopy));

    rolesServiceSpy.createRole(roleMockCopy).subscribe((response) => {
      expect(response).toEqual(messageResponseMockCopy);
    });

    expect(rolesServiceSpy.createRole)
      .withContext('Expected createRole to have been called')
      .toHaveBeenCalledOnceWith(roleMockCopy);
  });

  it('should call updateRole', () => {
    rolesServiceSpy.updateRole.and.returnValue(of(messageResponseMockCopy));

    rolesServiceSpy.updateRole(roleMockCopy, roleMockCopy.id).subscribe((response) => {
      expect(response).toEqual(messageResponseMockCopy);
    });

    expect(rolesServiceSpy.updateRole)
      .withContext('Expected updateRole to have been called')
      .toHaveBeenCalledOnceWith(roleMockCopy, roleMockCopy.id);
  });

  it('should call deleteRole', () => {
    rolesServiceSpy.deleteRole.and.returnValue(of(messageResponseMockCopy));

    rolesServiceSpy.deleteRole(roleMockCopy.id).subscribe((response) => {
      expect(response).toEqual(messageResponseMockCopy);
    });

    expect(rolesServiceSpy.deleteRole)
      .withContext('Expected deleteRole to have been called')
      .toHaveBeenCalledOnceWith(roleMockCopy.id);
  });

  it('should call checkRoleName', () => {
    rolesServiceSpy.checkRoleName.and.returnValue(of(true));

    rolesServiceSpy.checkRoleName(roleMockCopy.name).subscribe((response) => {
      expect(response).toBeTrue();
    });

    expect(rolesServiceSpy.checkRoleName)
      .withContext('Expected checkRoleName to have been called')
      .toHaveBeenCalledOnceWith(roleMockCopy.name);
  });
});
