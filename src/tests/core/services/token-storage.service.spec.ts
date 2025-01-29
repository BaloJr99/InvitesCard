import { TestBed } from '@angular/core/testing';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { tokenMock, userMock } from 'src/tests/mocks/mocks';

describe('Token Storage Service', () => {
  let tokenStorageService: TokenStorageService;
  let tokenStorageServiceSpy: jasmine.SpyObj<TokenStorageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TokenStorageService', [
      'saveToken',
      'getToken',
      'getTokenValues',
      'signOut',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: TokenStorageService, useValue: spy }],
    });

    tokenStorageServiceSpy = TestBed.inject(
      TokenStorageService
    ) as jasmine.SpyObj<TokenStorageService>;
  });

  it('should be created', () => {
    tokenStorageService = TestBed.inject(TokenStorageService);
    expect(tokenStorageService)
      .withContext('Expected Token Storage Service to have been created')
      .toBeTruthy();
  });

  it('should call saveToken', () => {
    tokenStorageServiceSpy.saveToken(tokenMock.access_token);

    expect(tokenStorageServiceSpy.saveToken)
      .withContext('Expected saveToken to have been called')
      .toHaveBeenCalledOnceWith(tokenMock.access_token);
  });

  it('should call getToken', () => {
    tokenStorageServiceSpy.getToken.and.returnValue(tokenMock.access_token);

    expect(tokenStorageServiceSpy.getToken()).toBe(tokenMock.access_token);

    expect(tokenStorageServiceSpy.getToken)
      .withContext('Expected getToken to have been called')
      .toHaveBeenCalledTimes(1);
  });

  it('should call getTokenValues', () => {
    tokenStorageServiceSpy.getTokenValues.and.returnValue(userMock);

    expect(tokenStorageServiceSpy.getTokenValues()).toEqual(userMock);

    expect(tokenStorageServiceSpy.getTokenValues)
      .withContext('Expected getUser to have been called')
      .toHaveBeenCalledTimes(1);
  });

  it('should call signOut', () => {
    tokenStorageServiceSpy.signOut();

    expect(tokenStorageServiceSpy.signOut)
      .withContext('Expected signOut to have been called')
      .toHaveBeenCalledTimes(1);
  });
});
