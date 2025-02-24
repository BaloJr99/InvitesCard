import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Home',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class HomeModule {}
