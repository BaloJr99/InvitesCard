import { TestBed } from '@angular/core/testing';
import { ErrorModalService } from 'src/app/core/services/error.service';

describe('ErrorModalService', () => {
  let errorService: ErrorModalService;
  let errorServiceSpy: jasmine.SpyObj<ErrorModalService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ErrorModalService', ['setError']);

    TestBed.configureTestingModule({
      providers: [{ provide: ErrorModalService, useValue: spy }],
    });

    errorServiceSpy = TestBed.inject(
      ErrorModalService
    ) as jasmine.SpyObj<ErrorModalService>;
  });

  it('should be created', () => {
    errorService = TestBed.inject(ErrorModalService);
    expect(errorService)
      .withContext('Expected Error Modal Service to have been created')
      .toBeTruthy();
  });

  it('should call setData', () => {
    errorServiceSpy.setError(true, null);
    expect(errorServiceSpy.setError)
      .withContext('Expected setError to have been called')
      .toHaveBeenCalledOnceWith(true, null);
  });
});
