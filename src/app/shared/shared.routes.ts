import { Routes } from '@angular/router';

export const shared_routes: Routes = [
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./components/not-authorized/not-authorized.component').then(
        (m) => m.NotAuthorizedComponent
      ),
  },
  {
    path: 'page-not-found',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
