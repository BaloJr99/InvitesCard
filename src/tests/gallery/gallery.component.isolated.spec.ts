import { of } from 'rxjs';
import { GalleryComponent } from 'src/app/gallery/gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;

  beforeEach(async () => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
      params: of(),
    });
    const routerSpy = jasmine.createSpyObj('Router', ['']);

    component = new GalleryComponent(activatedRouteSpy, routerSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
