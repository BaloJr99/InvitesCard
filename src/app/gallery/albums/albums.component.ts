import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import {
  IAlbum,
  IAlbumAction,
  IAlbumResolved,
  IUpsertAlbum,
} from 'src/app/core/models/gallery';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { AlbumModalComponent } from './album-modal/album-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-albums',
  imports: [AlbumModalComponent, CommonModule, RouterModule],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css',
})
export class AlbumsComponent {
  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute
  ) {}

  albumsResolved = {} as IAlbumResolved;

  private baseAlbum = {
    id: '',
    nameOfAlbum: '',
    eventId: '',
  } as IUpsertAlbum;

  albumAction: IAlbumAction = {
    album: {
      ...this.baseAlbum,
    },
    isNew: true,
  } as IAlbumAction;

  showAlbumModal = false;

  private albums = new BehaviorSubject<IAlbum[]>([]);
  albums$ = this.albums.asObservable();

  vm$ = this.route.data.pipe(
    map((data) => {
      this.albumsResolved = data['albumResolved'];

      // Get parent id from the route
      const nameOfAlbum = this.route.snapshot.paramMap.get('id');

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

  createNewAlbum() {
    this.showAlbumModal = true;
    this.albumAction = {
      album: {
        ...this.baseAlbum,
        eventId: this.albumsResolved.eventId,
      },
      isNew: true,
    };
  }

  editAlbum(album: IAlbum) {
    this.showAlbumModal = true;
    this.albumAction = {
      album: {
        ...album,
      },
      isNew: false,
    };
  }

  deleteAlbum(albumId: string) {
    this.galleryService.deleteAlbum(albumId).subscribe(() => {
      const oldAlbums = this.albums.value;
      const newAlbums = oldAlbums.filter((album) => album.id !== albumId);
      this.albums.next(newAlbums);
    });
  }

  closeAlbumModal() {
    this.showAlbumModal = false;
  }

  updateAlbums(albumAction: IAlbumAction) {
    if (albumAction.isNew) {
      this.albums.next([
        ...this.albums.value,
        {
          ...albumAction.album,
          dateOfAlbum: new Date().toLocaleDateString(),
          isActive: true,
        },
      ]);
    } else {
      const oldAlbums = this.albums.value;

      const albumIndex = oldAlbums.findIndex(
        (album) => album.id === albumAction.album.id
      );

      oldAlbums[albumIndex] = {
        ...albumAction.album,
        dateOfAlbum: oldAlbums[albumIndex].dateOfAlbum,
        isActive: oldAlbums[albumIndex].isActive,
      };

      this.albums.next(oldAlbums);
    }

    this.showAlbumModal = false;
  }
}
