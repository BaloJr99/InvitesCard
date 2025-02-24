import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Users',
    component: UsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class UsersModule {}
