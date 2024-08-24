import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { UsersService } from "src/app/core/services/users.service";
import { ForgotPasswordComponent } from "./forgot-password.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";

const routes: Routes = [
  { 
    path: '',
    component: ForgotPasswordComponent
  },
  {
    path: ':id',
    loadChildren: () => import('./password-reset/password-reset.module').then(m => m.PasswordResetModule)
  }
]

@NgModule({
  providers: [
    UsersService
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ 
    PasswordResetComponent
  ]
})

export class ForgotPasswordModule { }