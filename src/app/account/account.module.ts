import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AccountRoutingModule } from './account.routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    AccountRoutingModule,
    SharedModule
  ],
  declarations: [AccountRoutingModule.components, LoginComponent, RegisterComponent]
})
export class AccountModule { }
