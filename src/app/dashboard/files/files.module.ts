import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from './files.component';

const routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Files',
    component: FilesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class FilesModule {}
