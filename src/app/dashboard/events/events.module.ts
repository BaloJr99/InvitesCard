import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { EventsComponent } from "./events.component";
import { EventModalComponent } from "./eventModal/modal.component";
import { eventResolver } from "./event-details/event-resolver.service";
import { EventsService } from "src/app/core/services/events.service";
import { UsersService } from "src/app/core/services/users.service";
import { DateFormatPipe } from "src/app/shared/pipes/date-format.pipe";

const routes: Routes = [
  { 
    path: '',
    component: EventsComponent
  },
  {
    path: ':id',
    loadChildren: () => import('./event-details/event-details.module').then(m => m.EventDetailsModule),
    resolve: { eventResolved: eventResolver }
  }
]

@NgModule({
  providers: [
    EventsService,
    UsersService
  ],
  imports: [
    SharedModule,
    DateFormatPipe,
    RouterModule.forChild(routes)
  ],
  declarations: [ 
    EventsComponent,
    EventModalComponent
  ]
})

export class EventsModule { }