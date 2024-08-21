import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const app_routes: Routes = [
  { 
    path: 'entries', 
    loadChildren: () => import('./entries/entries.module').then(m => m.EntriesModule) },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard],
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { 
    path: 'error', 
    loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule) },
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: '/auth/login' },
  { 
    path: '**', 
    redirectTo: '/error/page-not-found' 
  } // catch any unfound routes and redirect to home page
];

@NgModule({
  imports: [ RouterModule.forRoot(app_routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }
