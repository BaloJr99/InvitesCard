import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountdownComponent } from './countdown/countdown.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { InvitesComponent } from './invites.component';
import { invitesResolver } from './invites-resolver.service';

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
  ];
}
