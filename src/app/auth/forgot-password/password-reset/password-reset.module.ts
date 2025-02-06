import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { PasswordResetComponent } from './password-reset.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { passwordResetResolver } from './password-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: PasswordResetComponent,
    resolve: { reset: passwordResetResolver },
  },
];

@NgModule({
  providers: [AuthService],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class PasswordResetModule {}
