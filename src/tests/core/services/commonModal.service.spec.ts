import { TestBed } from '@angular/core/testing';
import { CommonModalResponse } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { commonModalMock } from 'src/tests/mocks/mocks';

describe('CommonModalService', () => {
  let commonModalService: CommonModalService;
  let commonModalServiceSpy: jasmine.SpyObj<CommonModalService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CommonModalService', [
      'setData',
      'sendResponse',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CommonModalService,
        { provide: CommonModalService, useValue: spy },
      ],
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

  it('should call setData', () => {
    commonModalServiceSpy.setData(commonModalMock);
    expect(commonModalServiceSpy.setData)
      .withContext('Expected setData to have been called')
      .toHaveBeenCalledOnceWith(commonModalMock);
  });

  it('should call sendResponse', () => {
    commonModalServiceSpy.sendResponse(CommonModalResponse.Confirm);
    expect(commonModalServiceSpy.sendResponse)
      .withContext('Expected sendResponse to have been called')
      .toHaveBeenCalledOnceWith(CommonModalResponse.Confirm);
  });
});
