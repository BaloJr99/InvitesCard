import { Routes } from '@angular/router';
import { eventResolver } from '../../core/resolvers/event.resolver';
import { gallery_routes } from './event-albums/event-gallery.routes';

export const events_routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Events',
    loadComponent: () =>
      import('./events.component').then((m) => m.EventsComponent),
  },
  {
    path: 'gallery',
    title: 'InvitesMX -- Gallery',
    children: [...gallery_routes],
  },
  {
    path: ':id',
    title: 'InvitesMX -- Event Details',
    loadComponent: () =>
      import('./event-details/event-details.component').then(
        (m) => m.EventDetailsComponent
      ),
    resolve: { eventResolved: eventResolver },
  },
];
