import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { AlbumsComponent } from 'src/app/gallery/albums/albums.component';
import { albumMock } from 'src/tests/mocks/mocks';

describe('AlbumsComponent (Shallow Test)', () => {
  let fixture: ComponentFixture<AlbumsComponent>;
  let galleryServiceSpy: jasmine.SpyObj<GalleryService>;

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
    const gallerySpy = jasmine.createSpyObj('GalleryService', ['getAlbums']);

    await TestBed.configureTestingModule({
      imports: [AlbumsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              albumResolved: { isActive: true, eventId: albumMock.eventId },
            }),
            snapshot: {
              params: {
                id: albumMock.nameOfAlbum,
              },
            },
          },
        },
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

    galleryServiceSpy.getAlbums.and.returnValue(of([albumMock]));

    fixture = TestBed.createComponent(AlbumsComponent);
    fixture.detectChanges();
  });

  it('should render a button in the breadcrumb header', () => {
    const breadcrumb =
      fixture.nativeElement.querySelector('.breadcrumb-header');
    const button = breadcrumb.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should render the album', () => {
    const albums = fixture.debugElement.queryAll(By.css('.card'));
    const editButton = albums[0].query(By.css('.edit-btn'));
    const cardTitle = albums[0].query(By.css('.card-title'));
    const dateOfAlbum = albums[0].query(By.css('small'));
    const linkDes = albums[0].queryAll(By.directive(RouterLink));
    const routerLinks = linkDes.map((de) => de.injector.get(RouterLink));

    expect(albums.length).toBe(1);
    expect(editButton)
      .withContext('Edit button should be rendered')
      .toBeTruthy();

    expect(cardTitle.nativeElement.textContent).toBe(albumMock.nameOfAlbum);
    expect(dateOfAlbum.nativeElement.textContent).toContain(
      albumMock.dateOfAlbum
    );

    routerLinks.forEach((link) => {
      expect(link.href).toBe(
        `/gallery/${albumMock.nameOfAlbum.replaceAll(' ', '%20')}/${
          albumMock.id
        }`
      );
    });
  });

  it('should call createNewAlbum when the button is clicked', () => {
    spyOn(fixture.componentInstance, 'createNewAlbum');

    const breadcrumbHeader = fixture.debugElement.query(
      By.css('.breadcrumb-header')
    );
    const button = breadcrumbHeader.query(By.css('button'));
    button.nativeElement.click();

    expect(fixture.componentInstance.createNewAlbum).toHaveBeenCalled();
  });

  it('should call editAlbum when the edit button is clicked', () => {
    spyOn(fixture.componentInstance, 'editAlbum');

    const albums = fixture.debugElement.queryAll(By.css('.card'));
    const editButton = albums[0].query(By.css('.edit-btn'));
    editButton.nativeElement.click();

    expect(fixture.componentInstance.editAlbum).toHaveBeenCalled();
  });
});
