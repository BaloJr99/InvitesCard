import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { IAlbumAction, IAlbumResolved } from 'src/app/core/models/gallery';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { AlbumsComponent } from 'src/app/gallery/albums/albums.component';

describe('AlbumsComponent (Isolated Test)', () => {
  let component: AlbumsComponent;
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
    data: of(),
  });
  const gallerySpy = jasmine.createSpyObj('GalleryService', ['']);
  const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: GalleryService, useValue: gallerySpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        DatePipe,
      ],
    });
    component = TestBed.createComponent(AlbumsComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.albumAction).toEqual({
      album: { id: '', nameOfAlbum: '', eventId: '' },
      isNew: true,
    } as IAlbumAction);
    expect(component.albumsResolved).toEqual({} as IAlbumResolved);
  });
});
