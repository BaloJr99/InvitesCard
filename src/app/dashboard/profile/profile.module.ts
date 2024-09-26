import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { ProfileComponent } from './profile.component';
import { profileResolver } from './profile-resolver.service';
import { ProfileModalComponent } from './profileModal/profile-modal.component';
import { ChangePasswordComponent } from './changePassword/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    resolve: { userProfile: profileResolver },
  },
  {
    path: ':id',
    component: ProfileComponent,
    resolve: { userProfile: profileResolver },
  },
];

@NgModule({
  providers: [UsersService],
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [
    ProfileComponent,
    ProfileModalComponent,
    ChangePasswordComponent,
  ],
})
export class ProfileModule {}
