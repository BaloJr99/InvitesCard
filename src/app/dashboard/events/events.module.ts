import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';

const routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Events',
    component: EventsComponent,
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./event-details/event-details.module').then(
        (m) => m.EventDetailsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class EventsModule {}
