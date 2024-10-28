import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { messageResponseMock, roleMock } from 'src/tests/mocks/mocks';

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
    rolesServiceSpy.getAllRoles.and.returnValue(of([roleMock]));

    rolesServiceSpy.getAllRoles().subscribe((response) => {
      expect(response).toEqual([roleMock]);
    });

    expect(rolesServiceSpy.getAllRoles)
      .withContext('Expected getAllRoles to have been called')
      .toHaveBeenCalledOnceWith();
  });

  it('should call getRoleById', () => {
    rolesServiceSpy.getRoleById.and.returnValue(of(roleMock));

    rolesServiceSpy.getRoleById(roleMock.id).subscribe((response) => {
      expect(response).toEqual(roleMock);
    });

    expect(rolesServiceSpy.getRoleById)
      .withContext('Expected getRoleById to have been called')
      .toHaveBeenCalledOnceWith(roleMock.id);
  });

  it('should call createRole', () => {
    rolesServiceSpy.createRole.and.returnValue(of(messageResponseMock));

    rolesServiceSpy.createRole(roleMock).subscribe((response) => {
      expect(response).toEqual(messageResponseMock);
    });

    expect(rolesServiceSpy.createRole)
      .withContext('Expected createRole to have been called')
      .toHaveBeenCalledOnceWith(roleMock);
  });

  it('should call updateRole', () => {
    rolesServiceSpy.updateRole.and.returnValue(of(messageResponseMock));

    rolesServiceSpy.updateRole(roleMock, roleMock.id).subscribe((response) => {
      expect(response).toEqual(messageResponseMock);
    });

    expect(rolesServiceSpy.updateRole)
      .withContext('Expected updateRole to have been called')
      .toHaveBeenCalledOnceWith(roleMock, roleMock.id);
  });

  it('should call deleteRole', () => {
    rolesServiceSpy.deleteRole.and.returnValue(of(messageResponseMock));

    rolesServiceSpy.deleteRole(roleMock.id).subscribe((response) => {
      expect(response).toEqual(messageResponseMock);
    });

    expect(rolesServiceSpy.deleteRole)
      .withContext('Expected deleteRole to have been called')
      .toHaveBeenCalledOnceWith(roleMock.id);
  });

  it('should call checkRoleName', () => {
    rolesServiceSpy.checkRoleName.and.returnValue(of(true));

    rolesServiceSpy.checkRoleName(roleMock.name).subscribe((response) => {
      expect(response).toBeTrue();
    });

    expect(rolesServiceSpy.checkRoleName)
      .withContext('Expected checkRoleName to have been called')
      .toHaveBeenCalledOnceWith(roleMock.name);
  });
});
