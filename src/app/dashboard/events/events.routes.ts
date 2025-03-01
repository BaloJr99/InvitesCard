import { Routes } from '@angular/router';
import { eventResolver } from './event-details/event.resolver';

export const events_routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Events',
    loadComponent: () =>
      import('./events.component').then((m) => m.EventsComponent),
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
