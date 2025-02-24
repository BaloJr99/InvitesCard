import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { auth_routes } from './auth/auth.routes';
import { invites_routes } from './invites/invites.routes';
import { shared_routes } from './shared/shared.routes';
import { dashboard_routes } from './dashboard/dashboard.routes';

export const routes: Routes = [
  {
    path: 'invites',
    children: [...invites_routes],
  },
  {
    path: 'dashboard',
    children: [...dashboard_routes],
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    children: [...auth_routes],
  },
  {
    path: 'error',
    children: [...shared_routes],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/auth/login',
  },
  {
    path: '**',
    redirectTo: '/error/page-not-found',
  }, // catch any unfound routes and redirect to home page
];
