import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth.routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from '../shared/pipes/validation-error.pipe';

@NgModule({
  imports: [
    AuthRoutingModule,
    SharedModule,
    ValidationPipe,
    ValidationErrorPipe,
  ],
  declarations: [
    AuthRoutingModule.components,
    LoginComponent,
    ForgotPasswordComponent,
  ],
})
export class AuthModule {}
