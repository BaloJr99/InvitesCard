import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';

const app_routes: Routes = [
  { path: 'entries', loadChildren: () => import('./entries/entries.module').then(m => m.EntriesModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: '', pathMatch: 'full', redirectTo: '/account/login' },
  { path: '**', component: PageNotFoundComponent } // catch any unfound routes and redirect to home page
];

@NgModule({
  imports: [ RouterModule.forRoot(app_routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }
