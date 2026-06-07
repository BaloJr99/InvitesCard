import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { AlbumModalComponent } from 'src/app/gallery/albums/album-modal/album-modal.component';

describe('AlbumModalComponent (Isolated Test)', () => {
  let component: AlbumModalComponent;
  const gallerySpy = jasmine.createSpyObj('GalleryService', ['']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: GalleryService, useValue: gallerySpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });
    component = TestBed.createComponent(AlbumModalComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
