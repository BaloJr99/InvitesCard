import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestingComponent } from './testing/testing.component';
import { environmentGuard } from '../core/guards/environment.guard';
import { adminGuard } from '../core/guards/admin.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'events',
        loadChildren: () =>
          import('./events/events.module').then((m) => m.EventsModule),
      },
      {
        path: 'files',
        loadChildren: () =>
          import('./files/files.module').then((m) => m.FilesModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [adminGuard],
      },
      {
        path: 'logs',
        loadChildren: () =>
          import('./logs/logs.module').then((m) => m.LoggerModule),
        canActivate: [adminGuard],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'testing',
        title: 'InvitesMX -- Testing',
        component: TestingComponent,
        canActivate: [environmentGuard],
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DashboardModule {}
