import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import { AuthService } from "src/app/core/services/auth.service";
import { ValidationPipe } from "src/app/shared/pipes/validation.pipe";
import { ValidationErrorPipe } from "src/app/shared/pipes/validation-error.pipe";

const routes: Routes = [
  { 
    path: '',
    component: ForgotPasswordComponent
  },
  {
    path: ':id',
    title: 'InvitesMX -- Reset Password',
    loadChildren: () => import('./password-reset/password-reset.module').then(m => m.PasswordResetModule)
  }
]

@NgModule({
  providers: [
    AuthService
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ValidationPipe,
    ValidationErrorPipe,
  ],
  declarations: [ 
    PasswordResetComponent
  ]
})

export class ForgotPasswordModule { }