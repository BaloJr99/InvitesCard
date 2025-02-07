import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import { ProfileComponent } from './profile.component';
import { profileResolver } from './profile-resolver.service';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';

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
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ValidationPipe,
    ValidationErrorPipe,
  ],
  declarations: [
    ProfileComponent,
    ProfileModalComponent,
    ChangePasswordComponent,
  ],
})
export class ProfileModule {}
