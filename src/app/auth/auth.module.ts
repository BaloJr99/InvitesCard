import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { loginGuard } from '../core/guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    title: 'InvitesMX -- Login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'forgotPassword',
    title: 'InvitesMX -- Forgot Password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AuthModule {}
