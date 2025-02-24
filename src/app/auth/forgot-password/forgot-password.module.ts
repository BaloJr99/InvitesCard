import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent,
  },
  {
    path: ':id',
    title: 'InvitesMX -- Reset Password',
    loadChildren: () =>
      import('./password-reset/password-reset.module').then(
        (m) => m.PasswordResetModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ForgotPasswordModule {}
