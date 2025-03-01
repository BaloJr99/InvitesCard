import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { AlbumComponent } from 'src/app/gallery/albums/album/album.component';
import { albumMock } from 'src/tests/mocks/mocks';

describe('AlbumComponent (Integrated Test)', () => {
  let fixture: ComponentFixture<AlbumComponent>;
  let galleryServiceSpy: jasmine.SpyObj<GalleryService>;
  let fileReaderServiceSpy: jasmine.SpyObj<FileReaderService>;

  const uploadFile = (file: File) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const fileInput = fixture.debugElement.query(By.css('#photoFiles'));
    fileInput.nativeElement.files = dataTransfer.files;
    fileInput.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const gallerySpy = jasmine.createSpyObj('GalleryService', [
      'getAlbumImages',
      'uploadImages',
    ]);
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', [
      'getBase64',
    ]);

    await TestBed.configureTestingModule({
      imports: [AlbumComponent],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: GalleryService, useValue: gallerySpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ albumResolved: { isActive: true, eventId: '' } }),
            snapshot: {
              params: {
                id: albumMock.nameOfAlbum,
                albumId: albumMock.id,
              },
            },
          },
        },
      ],
    }).compileComponents();

    galleryServiceSpy = TestBed.inject(
      GalleryService
    ) as jasmine.SpyObj<GalleryService>;

    fileReaderServiceSpy = TestBed.inject(
      FileReaderService
    ) as jasmine.SpyObj<FileReaderService>;

    galleryServiceSpy.getAlbumImages.and.returnValue(of([]));
    fileReaderServiceSpy.getBase64.and.returnValue(of('image'));

    fixture = TestBed.createComponent(AlbumComponent);
    fixture.detectChanges();
  });

  it('should call uploadImages method when form is submitted', () => {
    uploadFile(new File(['test'], 'filename', { type: 'image/png' }));

    const uploadForm = fixture.debugElement.query(By.css('.upload-form'));
    const buttons = uploadForm.queryAll(By.css('button'));
    const saveButton = buttons[0];

    saveButton.nativeElement.click();

    expect(galleryServiceSpy.uploadImages).toHaveBeenCalled();
  });
});
