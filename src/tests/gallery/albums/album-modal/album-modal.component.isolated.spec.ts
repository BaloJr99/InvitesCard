import { FormBuilder } from '@angular/forms';
import { AlbumModalComponent } from 'src/app/gallery/albums/album-modal/album-modal.component';

describe('AlbumModalComponent (Isolated Test)', () => {
  let component: AlbumModalComponent;

  beforeEach(async () => {
    const gallerySpy = jasmine.createSpyObj('GalleryService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    component = new AlbumModalComponent(
      gallerySpy,
      new FormBuilder(),
      toastrSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
