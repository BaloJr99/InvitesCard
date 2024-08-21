import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth.routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    AuthRoutingModule,
    SharedModule
  ],
  declarations: [AuthRoutingModule.components, LoginComponent]
})
export class AuthModule { }
