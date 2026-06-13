import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { FileReaderService } from 'src/app/core/services/file-reader.service';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { AlbumComponent } from 'src/app/gallery/albums/album/album.component';

describe('AlbumComponent (Isolated Test)', () => {
  let component: AlbumComponent;
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
    data: of(),
  });
  const gallerySpy = jasmine.createSpyObj('GalleryService', ['']);
  const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: GalleryService, useValue: gallerySpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });
    component = TestBed.createComponent(AlbumComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
