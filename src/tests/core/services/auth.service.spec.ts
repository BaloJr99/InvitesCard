import { AuthService } from 'src/app/core/services/auth.service';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  fullUserMock,
  loginDataMock,
  messageResponseMock,
  tokenMock,
} from 'src/tests/mocks/mocks';
import { deepCopy } from 'src/app/shared/utils/tools';

const fullUserMockCopy = deepCopy(fullUserMock)
const loginDataMockCopy = deepCopy(loginDataMock)
const messageResponseMockCopy = deepCopy(messageResponseMock)
const tokenMockCopy = deepCopy(tokenMock)

// Create a test suite for the AuthService
describe('AuthService', () => {
  let authService: AuthService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', [
      'loginAccount',
      'sendResetPassword',
      'sendResetPasswordToUser',
      'isUserResettingPassword',
      'resetPassword',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: spy }],
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    authService = TestBed.inject(AuthService);
    expect(authService)
      .withContext('Expected AuthService to have been created')
      .toBeTruthy();
  });

  it('should call loginAccount', () => {
    const response = tokenMockCopy;

    authServiceSpy.loginAccount.and.returnValue(of(response));
    authServiceSpy.loginAccount(loginDataMockCopy).subscribe((response) => {
      expect(response.access_token).toBe(tokenMockCopy.access_token);
    });

    expect(authServiceSpy.loginAccount)
      .withContext('Expected loginAccount to have been called')
      .toHaveBeenCalledOnceWith(loginDataMockCopy);
  });

  it('should call sendResetPassword', () => {
    authServiceSpy.sendResetPassword.and.returnValue(of(messageResponseMockCopy));

    authServiceSpy
      .sendResetPassword(loginDataMockCopy.usernameOrEmail)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMockCopy);
      });

    expect(authServiceSpy.sendResetPassword)
      .withContext('Expected sendResetPassword to have been called')
      .toHaveBeenCalledOnceWith(loginDataMockCopy.usernameOrEmail);
  });

  it('should call sendResetPasswordToUser', () => {
    authServiceSpy.sendResetPasswordToUser.and.returnValue(
      of(messageResponseMockCopy)
    );

    authServiceSpy
      .sendResetPasswordToUser(fullUserMockCopy.id)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMockCopy);
      });

    expect(authServiceSpy.sendResetPasswordToUser)
      .withContext('Expected sendResetPasswordToUser to have been called')
      .toHaveBeenCalledOnceWith(fullUserMockCopy.id);
  });

  it('should call isUserResettingPassword', () => {
    authServiceSpy.isUserResettingPassword.and.returnValue(of(true));

    authServiceSpy
      .isUserResettingPassword(fullUserMockCopy.id)
      .subscribe((response) => {
        expect(response).toBe(true);
      });

    expect(authServiceSpy.isUserResettingPassword)
      .withContext('Expected isUserResettingPassword to have been called')
      .toHaveBeenCalledOnceWith(fullUserMockCopy.id);
  });

  it('should call resetPassword', () => {
    authServiceSpy.resetPassword.and.returnValue(of(messageResponseMockCopy));

    authServiceSpy.resetPassword('test', 'password').subscribe((response) => {
      expect(response).toBe(messageResponseMockCopy);
    });

    expect(authServiceSpy.resetPassword)
      .withContext('Expected resetPassword to have been called')
      .toHaveBeenCalled();
  });
});
