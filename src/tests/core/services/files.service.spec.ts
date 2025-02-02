import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FilesService } from 'src/app/core/services/files.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  deleteFileMock,
  downloadFileMock,
  fullEventsMock,
  messageResponseMock,
  updateImageMock,
  uploadImageMock,
} from 'src/tests/mocks/mocks';

const deleteFileMockCopy = deepCopy(deleteFileMock);
const downloadFileMockCopy = deepCopy(downloadFileMock);
const fullEventsMockCopy = deepCopy(fullEventsMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);
const updateImageMockCopy = deepCopy(updateImageMock);
const uploadImageMockCopy = deepCopy(uploadImageMock);

describe('FilesService', () => {
  let filesService: FilesService;
  let filesServiceSpy: jasmine.SpyObj<FilesService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('FilesService', [
      'uploadImages',
      'uploadMusic',
      'getFilesByEvent',
      'deleteFile',
      'updateImage',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: FilesService, useValue: spy }],
    });

    filesServiceSpy = TestBed.inject(
      FilesService
    ) as jasmine.SpyObj<FilesService>;
  });

  it('should be created', () => {
    filesService = TestBed.inject(FilesService);
    expect(filesService)
      .withContext('Expected Files Service to have been created')
      .toBeTruthy();
  });

  it('should call uploadImages', () => {
    filesServiceSpy.uploadImages.and.returnValue(of(messageResponseMockCopy));

    filesServiceSpy.uploadImages(uploadImageMockCopy).subscribe((response) => {
      expect(response).toBe(messageResponseMockCopy);
    });

    expect(filesServiceSpy.uploadImages)
      .withContext('Expected uploadImages to have been called')
      .toHaveBeenCalledOnceWith(uploadImageMockCopy);
  });

  it('should call uploadMusic', () => {
    const formDataTest = new FormData();
    filesServiceSpy.uploadMusic.and.returnValue(of(messageResponseMockCopy));

    filesServiceSpy.uploadMusic(formDataTest).subscribe((response) => {
      expect(response).toBe(messageResponseMockCopy);
    });

    expect(filesServiceSpy.uploadMusic)
      .withContext('Expected uploadMusic to have been called')
      .toHaveBeenCalledOnceWith(formDataTest);
  });

  it('should call getFilesByEvent', () => {
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMockCopy));

    filesServiceSpy
      .getFilesByEvent(fullEventsMockCopy.id)
      .subscribe((response) => {
        expect(response).toBe(downloadFileMockCopy);
      });

    expect(filesServiceSpy.getFilesByEvent)
      .withContext('Expected getFilesByEvent to have been called')
      .toHaveBeenCalledOnceWith(fullEventsMockCopy.id);
  });

  it('should call deleteFile', () => {
    filesServiceSpy.deleteFile.and.returnValue(of(messageResponseMockCopy));

    filesServiceSpy.deleteFile(deleteFileMockCopy).subscribe((response) => {
      expect(response).toBe(messageResponseMockCopy);
    });

    expect(filesServiceSpy.deleteFile)
      .withContext('Expected deleteFile to have been called')
      .toHaveBeenCalledOnceWith(deleteFileMockCopy);
  });

  it('should call updateImage', () => {
    filesServiceSpy.updateImage.and.returnValue(of(messageResponseMockCopy));

    filesServiceSpy.updateImage([updateImageMockCopy]).subscribe((response) => {
      expect(response).toBe(messageResponseMockCopy);
    });

    expect(filesServiceSpy.updateImage)
      .withContext('Expected updateImage to have been called')
      .toHaveBeenCalledOnceWith([updateImageMockCopy]);
  });
});
