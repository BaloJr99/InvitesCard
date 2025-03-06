import { Routes } from '@angular/router';
import { galleryResolver } from 'src/app/core/resolvers/gallery.resolver';

export const gallery_routes: Routes = [
  {
    path: ':id',
    title: 'InvitesMX -- Albums',
    loadComponent: () =>
      import('./event-albums.component').then(
        (m) => m.AlbumsComponent
      ),
    resolve: { albumResolved: galleryResolver },
  },
  {
    path: ':id/:albumId',
    title: 'InvitesMX -- Album',
    loadComponent: () =>
      import('./event-album/event-album.component').then(
        (m) => m.AlbumComponent
      ),
    resolve: { albumResolved: galleryResolver },
  },
];
