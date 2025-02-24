import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordResetComponent } from './password-reset.component';
import { passwordResetResolver } from './password-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: PasswordResetComponent,
    resolve: { reset: passwordResetResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PasswordResetModule {}
