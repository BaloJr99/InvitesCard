import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailsComponent } from './event-details.component';
import { eventResolver } from './event-resolver.service';

const routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Event Details',
    component: EventDetailsComponent,
    resolve: { eventResolved: eventResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class EventDetailsModule {}
