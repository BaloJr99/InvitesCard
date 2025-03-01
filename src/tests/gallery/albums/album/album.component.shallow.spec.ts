import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { AlbumComponent } from 'src/app/gallery/albums/album/album.component';
import { albumImagesMock, albumMock } from 'src/tests/mocks/mocks';

describe('AlbumComponent (Shallow Test)', () => {
  let fixture: ComponentFixture<AlbumComponent>;
  let galleryService: jasmine.SpyObj<GalleryService>;

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
    ]);

    await TestBed.configureTestingModule({
      imports: [AlbumComponent],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: GalleryService, useValue: gallerySpy },
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
        provideHttpClient(),
      ],
    }).compileComponents();

    galleryService = TestBed.inject(
      GalleryService
    ) as jasmine.SpyObj<GalleryService>;

    galleryService.getAlbumImages.and.returnValue(of(albumImagesMock));

    fixture = TestBed.createComponent(AlbumComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the breadcrumb', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    const routerLinks = linkDes.map((de) => de.injector.get(RouterLink));

    routerLinks.forEach((link) => {
      expect(link.href).toBe(
        `/gallery/${albumMock.nameOfAlbum.replaceAll(' ', '%20')}`
      );
    });
  });

  it('should render a form with the upload input, a label and a button', () => {
    const form = fixture.debugElement.query(By.css('form'));
    const input = form.query(By.css('input'));
    const label = form.query(By.css('label'));
    const button = form.query(By.css('button'));

    expect(form).withContext('Form should be rendered').toBeTruthy();
    expect(input).withContext('Input should be rendered').toBeTruthy();
    expect(label.nativeElement.textContent).toContain('Seleccionar fotos');
    expect(button.nativeElement.textContent).toContain('Subir fotos');
  });

  it('should render one image for each image in the album', () => {
    const imageContainer = fixture.debugElement.queryAll(
      By.css('.image-container img')
    );
    expect(imageContainer.length).toBe(albumImagesMock.length);
  });
  
    it('should call saveFiles when saving an uploaded photo', () => {
      spyOn(fixture.componentInstance, 'saveFiles');
      uploadFile(new File([''], 'filename', { type: 'image/png' }));
  
      const uploadForm = fixture.debugElement.query(By.css('.upload-form'));
      const buttons = uploadForm.queryAll(By.css('button'));
      const saveButton = buttons[0];
  
      saveButton.nativeElement.click();
  
      expect(fixture.componentInstance.saveFiles)
        .withContext('saveFiles should be called')
        .toHaveBeenCalled();
    });
});
