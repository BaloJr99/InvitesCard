import { Routes } from '@angular/router';
import { passwordResetResolver } from './forgot-password/password-reset/password-resolver.service';
import { loginGuard } from '../core/guards/login.guard';

export const auth_routes: Routes = [
  {
    path: 'login',
    title: 'InvitesMX -- Login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'forgotPassword',
    title: 'InvitesMX -- Forgot Password',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: ':id',
        title: 'InvitesMX -- Reset Password',
        loadComponent: () =>
          import(
            './forgot-password/password-reset/password-reset.component'
          ).then((m) => m.PasswordResetComponent),
        resolve: { reset: passwordResetResolver },
      },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
];
