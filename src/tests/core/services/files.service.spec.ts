import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FilesService } from 'src/app/core/services/files.service';
import {
  deleteFileMock,
  downloadFileMock,
  fullEventsMock,
  messageResponseMock,
  updateImageMock,
  uploadImageMock,
} from 'src/tests/mocks/mocks';

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
    filesServiceSpy.uploadImages.and.returnValue(of(messageResponseMock));

    filesServiceSpy.uploadImages(uploadImageMock).subscribe((response) => {
      expect(response).toBe(messageResponseMock);
    });

    expect(filesServiceSpy.uploadImages)
      .withContext('Expected uploadImages to have been called')
      .toHaveBeenCalledOnceWith(uploadImageMock);
  });

  it('should call uploadMusic', () => {
    const formDataTest = new FormData();
    filesServiceSpy.uploadMusic.and.returnValue(of(messageResponseMock));

    filesServiceSpy.uploadMusic(formDataTest).subscribe((response) => {
      expect(response).toBe(messageResponseMock);
    });

    expect(filesServiceSpy.uploadMusic)
      .withContext('Expected uploadMusic to have been called')
      .toHaveBeenCalledOnceWith(formDataTest);
  });

  it('should call getFilesByEvent', () => {
    filesServiceSpy.getFilesByEvent.and.returnValue(of(downloadFileMock));

    filesServiceSpy.getFilesByEvent(fullEventsMock.id).subscribe((response) => {
      expect(response).toBe(downloadFileMock);
    });

    expect(filesServiceSpy.getFilesByEvent)
      .withContext('Expected getFilesByEvent to have been called')
      .toHaveBeenCalledOnceWith(fullEventsMock.id);
  });

  it('should call deleteFile', () => {
    filesServiceSpy.deleteFile.and.returnValue(of(messageResponseMock));

    filesServiceSpy.deleteFile(deleteFileMock).subscribe((response) => {
      expect(response).toBe(messageResponseMock);
    });

    expect(filesServiceSpy.deleteFile)
      .withContext('Expected deleteFile to have been called')
      .toHaveBeenCalledOnceWith(deleteFileMock);
  });

  it('should call updateImage', () => {
    filesServiceSpy.updateImage.and.returnValue(of(messageResponseMock));

    filesServiceSpy.updateImage([updateImageMock]).subscribe((response) => {
      expect(response).toBe(messageResponseMock);
    });

    expect(filesServiceSpy.updateImage)
      .withContext('Expected updateImage to have been called')
      .toHaveBeenCalledOnceWith([updateImageMock]);
  });
});
