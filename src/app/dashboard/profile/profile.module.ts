import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { profileResolver } from './profile-resolver.service';

const routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Profile',
    component: ProfileComponent,
    resolve: { userProfile: profileResolver },
  },
  {
    path: ':id',
    title: 'InvitesMX -- Profile',
    component: ProfileComponent,
    resolve: { userProfile: profileResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProfileModule {}
