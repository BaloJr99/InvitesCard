import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AccountRoutingModule } from './account.routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    AccountRoutingModule,
    SharedModule
  ],
  declarations: [AccountRoutingModule.components, LoginComponent]
})
export class AccountModule { }
