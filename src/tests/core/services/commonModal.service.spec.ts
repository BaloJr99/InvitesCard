import { TestBed } from '@angular/core/testing';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import { commonModalMock } from 'src/tests/mocks/mocks';

const commonModalMockCopy = deepCopy(commonModalMock);

describe('CommonModalService', () => {
  let commonModalService: CommonModalService;
  let commonModalServiceSpy: jasmine.SpyObj<CommonModalService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CommonModalService', [
      'open',
      'closeModal',
      'confirmModal',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: CommonModalService, useValue: spy }],
    });

    commonModalServiceSpy = TestBed.inject(
      CommonModalService
    ) as jasmine.SpyObj<CommonModalService>;
  });

  it('should be created', () => {
    commonModalService = TestBed.inject(CommonModalService);
    expect(commonModalService)
      .withContext('Expected Common Modal Service to have been created')
      .toBeTruthy();
  });

  it('should call open', () => {
    commonModalServiceSpy.open(commonModalMockCopy);

    expect(commonModalServiceSpy.open)
      .withContext('Expected open to have been called')
      .toHaveBeenCalledOnceWith(commonModalMockCopy);
  });

  it('should call sendResponse', () => {
    commonModalServiceSpy.closeModal();
    expect(commonModalServiceSpy.closeModal)
      .withContext('Expected closeModal to have been called')
      .toHaveBeenCalled();
  });
});
