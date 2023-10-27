import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { loginGuard } from 'src/core/guards/login.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [loginGuard] 
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