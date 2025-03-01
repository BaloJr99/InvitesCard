import { of } from 'rxjs';
import { IAlbumAction, IAlbumResolved } from 'src/app/core/models/gallery';
import { AlbumsComponent } from 'src/app/gallery/albums/albums.component';

describe('AlbumsComponent (Isolated Test)', () => {
  let component: AlbumsComponent;

  beforeEach(async () => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
      data: of(),
    });
    const gallerySpy = jasmine.createSpyObj('GalleryService', ['']);
    component = new AlbumsComponent(gallerySpy, activatedRouteSpy);
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
