import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { IAlbumImage, IAlbumResolved } from 'src/app/core/models/gallery';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-event-album',
  imports: [SharedModule],
  templateUrl: './event-album.component.html',
  styleUrl: './event-album.component.css',
})
export class AlbumComponent {
  constructor(
    private route: ActivatedRoute,
    private galleryService: GalleryService
  ) {}

  private albumResolved = {} as IAlbumResolved;

  private albumImages = new BehaviorSubject<IAlbumImage[]>([]);
  albumImages$ = this.albumImages.asObservable();

  private refreshImages = new BehaviorSubject<boolean>(true);
  refreshImages$ = this.refreshImages.asObservable();

  vm$ = this.route.data.pipe(
    map((data) => {
      this.albumResolved = data['albumResolved'];

      // Get parent id from the route
      const nameOfEvent = this.route.snapshot.params['id'];
      const albumId = this.route.snapshot.params['albumId'];

      return {
        isActive: this.albumResolved.isActive,
        albumId,
        nameOfEvent,
      };
    }),
    switchMap((albumImagesResolved) =>
      this.refreshImages$.pipe(
        map(() => {
          return albumImagesResolved;
        }),
        switchMap((albumImagesResolved) =>
          this.galleryService.getAlbumImages(albumImagesResolved.albumId).pipe(
            tap((albumImages) => {
              this.albumImages.next(albumImages);
            }),
            map(() => {
              return {
                isActive: albumImagesResolved.isActive,
                nameOfEvent: albumImagesResolved.nameOfEvent,
              };
            })
          )
        )
      )
    )
  );
}
