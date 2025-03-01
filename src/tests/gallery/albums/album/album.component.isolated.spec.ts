import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { AlbumComponent } from 'src/app/gallery/albums/album/album.component';

describe('AlbumComponent (Isolated Test)', () => {
  let component: AlbumComponent;

  beforeEach(async () => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
      data: of(),
    });
    const gallerySpy = jasmine.createSpyObj('GalleryService', ['']);
    const fileReaderSpy = jasmine.createSpyObj('FileReader', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    component = new AlbumComponent(
      new FormBuilder(),
      activatedRouteSpy,
      gallerySpy,
      fileReaderSpy,
      toastrSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
