import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountdownComponent } from './sweetXv/countdown/countdown.component';
import { ConfirmationComponent } from './sweetXv/confirmation/confirmation.component';
import { InvitesComponent } from './invites.component';
import { invitesResolver } from './invites-resolver.service';
import { SweetXvComponent } from './sweetXv/sweet-xv.component';

const routes: Routes = [
  {
    path: ':id',
    component: InvitesComponent,
    resolve: { invite: invitesResolver },
  },
  { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitesRoutingModule {
  static components = [
    InvitesComponent,
    CountdownComponent,
    ConfirmationComponent,
    SweetXvComponent,
  ];
}
