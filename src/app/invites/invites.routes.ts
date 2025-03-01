import { invitesResolver } from './invites.resolver';
import { Routes } from '@angular/router';

export const invites_routes: Routes = [
  {
    path: ':id',
    title: 'InvitesMX -- Invite',
    loadComponent: () =>
      import('./invites.component').then((m) => m.InvitesComponent),
    resolve: { invite: invitesResolver },
  },
];
