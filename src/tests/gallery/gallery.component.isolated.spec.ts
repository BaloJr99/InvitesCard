import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { GalleryComponent } from 'src/app/gallery/gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
    params: of(),
  });
  const routerSpy = jasmine.createSpyObj('Router', ['']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    component = TestBed.createComponent(GalleryComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
