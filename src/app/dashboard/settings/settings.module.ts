import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Settings',
    component: SettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SettingsModule {}
