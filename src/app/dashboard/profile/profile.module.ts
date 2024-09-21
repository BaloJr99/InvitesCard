import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';
import { ProfileComponent } from './profile.component';
import { profileResolver } from './profile-resolver.service';
import { ProfileModalComponent } from './profileModal/profile-modal.component';

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
  imports: [SharedModule, DateFormatPipe, RouterModule.forChild(routes)],
  declarations: [ProfileComponent, ProfileModalComponent],
})
export class ProfileModule {}
