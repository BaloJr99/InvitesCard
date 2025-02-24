import { NgModule } from '@angular/core';
import { InvitesComponent } from './invites.component';
import { invitesResolver } from './invites-resolver.service';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':id',
    title: 'InvitesMX -- Invite',
    component: InvitesComponent,
    resolve: { invite: invitesResolver },
  },
  { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitesModule {}
