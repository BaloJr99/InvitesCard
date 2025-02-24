import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from './logs.component';

const routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Logs',
    component: LogsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class LoggerModule {}
