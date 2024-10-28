import { AuthService } from 'src/app/core/services/auth.service';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  fullUserMock,
  loginDataMock,
  messageResponseMock,
  tokenMock,
} from 'src/tests/mocks/mocks';

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
    const response = tokenMock;

    authServiceSpy.loginAccount.and.returnValue(of(response));
    authServiceSpy.loginAccount(loginDataMock).subscribe((response) => {
      expect(response.token).toBe(tokenMock.token);
    });

    expect(authServiceSpy.loginAccount)
      .withContext('Expected loginAccount to have been called')
      .toHaveBeenCalledOnceWith(loginDataMock);
  });

  it('should call sendResetPassword', () => {
    authServiceSpy.sendResetPassword.and.returnValue(of(messageResponseMock));

    authServiceSpy
      .sendResetPassword(loginDataMock.usernameOrEmail)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMock);
      });

    expect(authServiceSpy.sendResetPassword)
      .withContext('Expected sendResetPassword to have been called')
      .toHaveBeenCalledOnceWith(loginDataMock.usernameOrEmail);
  });

  it('should call sendResetPasswordToUser', () => {
    authServiceSpy.sendResetPasswordToUser.and.returnValue(
      of(messageResponseMock)
    );

    authServiceSpy
      .sendResetPasswordToUser(fullUserMock.id)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMock);
      });

    expect(authServiceSpy.sendResetPasswordToUser)
      .withContext('Expected sendResetPasswordToUser to have been called')
      .toHaveBeenCalledOnceWith(fullUserMock.id);
  });

  it('should call isUserResettingPassword', () => {
    authServiceSpy.isUserResettingPassword.and.returnValue(of(true));

    authServiceSpy
      .isUserResettingPassword(fullUserMock.id)
      .subscribe((response) => {
        expect(response).toBe(true);
      });

    expect(authServiceSpy.isUserResettingPassword)
      .withContext('Expected isUserResettingPassword to have been called')
      .toHaveBeenCalledOnceWith(fullUserMock.id);
  });

  it('should call resetPassword', () => {
    authServiceSpy.resetPassword.and.returnValue(of(messageResponseMock));

    authServiceSpy.resetPassword('test', 'password').subscribe((response) => {
      expect(response).toBe(messageResponseMock);
    });

    expect(authServiceSpy.resetPassword)
      .withContext('Expected resetPassword to have been called')
      .toHaveBeenCalled();
  });
});
