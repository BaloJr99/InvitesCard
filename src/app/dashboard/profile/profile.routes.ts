import { Routes } from '@angular/router';
import { profileResolver } from '../../core/resolvers/profile.resolver';

export const profile_routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Profile',
    loadComponent: () =>
      import('./profile.component').then((m) => m.ProfileComponent),
    resolve: { userProfile: profileResolver },
  },
  {
    path: ':id',
    title: 'InvitesMX -- Profile',
    loadComponent: () =>
      import('./profile.component').then((m) => m.ProfileComponent),
    resolve: { userProfile: profileResolver },
  },
];
