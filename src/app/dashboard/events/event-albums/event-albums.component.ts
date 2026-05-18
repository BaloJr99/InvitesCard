import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { IAlbum, IAlbumResolved } from 'src/app/core/models/gallery';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { CommonModule } from '@angular/common';
import { QrCodeModalComponent } from 'src/app/shared/components/qr-code-modal/qr-code-modal.component';

@Component({
  selector: 'app-event-albums',
  imports: [CommonModule, RouterModule, QrCodeModalComponent],
  templateUrl: './event-albums.component.html',
  styleUrl: './event-albums.component.css',
})
export class AlbumsComponent {
  private galleryService = inject(GalleryService);
  private route = inject(ActivatedRoute);

  galleryUrl = '';
  showQRCode = false;

  albumsResolved = {} as IAlbumResolved;

  private albums = new BehaviorSubject<IAlbum[]>([]);
  albums$ = this.albums.asObservable();

  vm$ = this.route.data.pipe(
    map((data) => {
      this.albumsResolved = data['albumResolved'];

      // Get parent id from the route
      const nameOfAlbum = this.route.snapshot.params['id'];
      this.galleryUrl = `${window.location.origin}/gallery/${nameOfAlbum}`;

      return {
        eventId: this.albumsResolved.eventId,
        isActive: this.albumsResolved.isActive,
        nameOfAlbum,
      };
    }),
    switchMap((albumsResolved) =>
      this.galleryService.getAlbums(albumsResolved.eventId).pipe(
        tap((albums) => {
          this.albums.next(albums);
        }),
        map(() => {
          return {
            isActive: albumsResolved.isActive,
            nameOfAlbum: albumsResolved.nameOfAlbum,
          };
        })
      )
    )
  );

  openQRCodeModal() {
    this.showQRCode = true;
  }

  closeQRCodeModal() {
    this.showQRCode = false;
  }
}
