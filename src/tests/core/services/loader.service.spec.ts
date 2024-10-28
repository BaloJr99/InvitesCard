import { TestBed } from '@angular/core/testing';
import { LoaderService } from 'src/app/core/services/loader.service';

describe('Loader Service', () => {
  let loaderService: LoaderService;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LoaderService', ['setLoading']);

    TestBed.configureTestingModule({
      providers: [{ provide: LoaderService, useValue: spy }],
    });

    loaderServiceSpy = TestBed.inject(
      LoaderService
    ) as jasmine.SpyObj<LoaderService>;
  });

  it('should be created', () => {
    loaderService = TestBed.inject(LoaderService);
    expect(loaderService)
      .withContext('Expected Loader Service to have been created')
      .toBeTruthy();
  });

  it('should call setLoading', () => {
    loaderServiceSpy.setLoading(true, 'Test Message', false);

    expect(loaderServiceSpy.setLoading)
      .withContext('Expected show to have been called')
      .toHaveBeenCalledTimes(1);
  });
});
