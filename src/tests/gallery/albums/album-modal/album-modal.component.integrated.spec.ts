import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { IAlbumAction } from 'src/app/core/models/gallery';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { AlbumModalComponent } from 'src/app/gallery/albums/album-modal/album-modal.component';
import { albumMock, messageResponseMock } from 'src/tests/mocks/mocks';

describe('AlbumModalComponent (Integrated Test)', () => {
  let fixture: ComponentFixture<AlbumModalComponent>;
  let galleryServiceSpy: jasmine.SpyObj<GalleryService>;

  const updateFormUsingEvent = (nameOfAlbum: string) => {
    const nameOfAlbumInput = fixture.debugElement.query(By.css('#nameOfAlbum'));

    nameOfAlbumInput.nativeElement.value = nameOfAlbum;
    nameOfAlbumInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
  };

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const gallerySpy = jasmine.createSpyObj('GalleryService', [
      'createAlbum',
      'updateAlbum',
      'checkAlbum',
    ]);

    await TestBed.configureTestingModule({
      imports: [AlbumModalComponent],
      providers: [
        {
          provide: ToastrService,
          useValue: toastrSpy,
        },
        {
          provide: GalleryService,
          useValue: gallerySpy,
        },
        provideHttpClient(),
      ],
    }).compileComponents();

    galleryServiceSpy = TestBed.inject(
      GalleryService
    ) as jasmine.SpyObj<GalleryService>;

    galleryServiceSpy.createAlbum.and.returnValue(of(messageResponseMock));
    galleryServiceSpy.updateAlbum.and.returnValue(of(messageResponseMock));
    galleryServiceSpy.checkAlbum.and.returnValue(of(false));

    fixture = TestBed.createComponent(AlbumModalComponent);
    fixture.detectChanges();
  });

  it('galleryService createInvite() should called', () => {
    fixture.componentRef.setInput('showModalValue', true);
    fixture.componentRef.setInput('albumActionValue', {
      album: {
        eventId: albumMock.eventId,
        id: '',
        nameOfAlbum: '',
        thumbnail: '',
      },
      isNew: true,
    } as IAlbumAction);
    fixture.detectChanges();

    updateFormUsingEvent(albumMock.nameOfAlbum);

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];
    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(galleryServiceSpy.createAlbum)
      .withContext(
        "createAlbum method from GalleryService should've been called"
      )
      .toHaveBeenCalled();
  });

  it('galleryService updateAlbum() should called', () => {
    fixture.componentRef.setInput('showModalValue', true);
    fixture.componentRef.setInput('albumActionValue', {
      album: {
        eventId: albumMock.eventId,
        id: albumMock.id,
        nameOfAlbum: albumMock.nameOfAlbum,
        thumbnail: albumMock.thumbnail,
      },
      isNew: false,
    } as IAlbumAction);
    fixture.detectChanges();

    updateFormUsingEvent('New name of album');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];
    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(galleryServiceSpy.updateAlbum)
      .withContext(
        "updateAlbum method from GalleryService should've been called"
      )
      .toHaveBeenCalled();
  });
});
