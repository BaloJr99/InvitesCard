import { Routes } from '@angular/router';
import { galleryResolver } from './gallery.resolver';

export const gallery_routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Gallery',
    loadComponent: () =>
      import('./gallery.component').then((m) => m.GalleryComponent),
    children: [
      {
        path: ':id',
        title: 'InvitesMX -- Albums',
        loadComponent: () =>
          import('./albums/albums.component').then((m) => m.AlbumsComponent),
        resolve: { albumResolved: galleryResolver },
      },
      {
        path: ':id/:albumId',
        title: 'InvitesMX -- Album',
        loadComponent: () =>
          import('./albums/album/album.component').then(
            (m) => m.AlbumComponent
          ),
        resolve: { albumResolved: galleryResolver },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
