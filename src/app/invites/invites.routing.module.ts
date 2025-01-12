import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountdownComponent } from './shared/countdown/countdown.component';
import { ConfirmationComponent } from './shared/confirmation/confirmation.component';
import { InvitesComponent } from './invites.component';
import { invitesResolver } from './invites-resolver.service';
import { SweetXvComponent } from './sweet-xv/sweet-xv.component';
import { SaveTheDateComponent } from './save-the-date/save-the-date.component';
import { AccomodationComponent } from './save-the-date/accomodations/accomodation.component';
import { WeddingComponent } from './wedding/wedding.component';

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
    AccomodationComponent,
    InvitesComponent,
    CountdownComponent,
    ConfirmationComponent,
    SweetXvComponent,
    SaveTheDateComponent,
    WeddingComponent,
  ];
}
