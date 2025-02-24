import { Routes } from '@angular/router';
import { environmentGuard } from '../core/guards/environment.guard';
import { adminGuard } from '../core/guards/admin.guard';
import { events_routes } from './events/events.routes';
import { profile_routes } from './profile/profile.routes';

export const dashboard_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: 'home',
        title: 'InvitesMX -- Home',
        loadComponent: () =>
          import('./home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'events',
        children: [...events_routes],
      },
      {
        path: 'files',
        title: 'InvitesMX -- Files',
        loadComponent: () =>
          import('./files/files.component').then((m) => m.FilesComponent),
      },
      {
        path: 'users',
        title: 'InvitesMX -- Users',
        loadComponent: () =>
          import('./users/users.component').then((m) => m.UsersComponent),
        canActivate: [adminGuard],
      },
      {
        path: 'logs',
        title: 'InvitesMX -- Logs',
        loadComponent: () =>
          import('./logs/logs.component').then((m) => m.LogsComponent),
        canActivate: [adminGuard],
      },
      {
        path: 'settings',
        title: 'InvitesMX -- Settings',
        loadComponent: () =>
          import('./settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'profile',
        children: [...profile_routes],
      },
      {
        path: 'testing',
        title: 'InvitesMX -- Testing',
        loadComponent: () =>
          import('./testing/testing.component').then((m) => m.TestingComponent),
        canActivate: [environmentGuard],
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];
