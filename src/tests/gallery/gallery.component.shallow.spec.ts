import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { GalleryComponent } from 'src/app/gallery/gallery.component';
import { albumMock } from '../mocks/mocks';

describe('GalleryComponent', () => {
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of(''),
            snapshot: {
              params: {
                id: albumMock.nameOfAlbum,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    fixture.detectChanges();
  });

  it('should render the album name', () => {
    const navBar = fixture.debugElement.query(By.css('nav'));
    const header = navBar.query(By.css('h1'));

    expect(header.nativeElement.textContent).toBe(albumMock.nameOfAlbum);
  });
});
