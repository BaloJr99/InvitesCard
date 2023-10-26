import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { canActivateLogin } from 'src/core/guards/login.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [canActivateLogin] 
  },
  { path: 'register', component: RegisterComponent },
  { path: '', pathMatch: 'full', redirectTo: '/account/login' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {
  static components = [LoginComponent, RegisterComponent];
}