import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth.routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [AuthRoutingModule, SharedModule],
  declarations: [
    AuthRoutingModule.components,
    LoginComponent,
    ForgotPasswordComponent,
  ],
})
export class AuthModule {}
