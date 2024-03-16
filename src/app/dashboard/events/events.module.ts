import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { DateFormatPipe } from "src/core/pipes/date-format.pipe";
import { RouterModule, Routes } from "@angular/router";
import { EventsComponent } from "./events.component";
import { EventsService } from "src/core/services/events.service";
import { EventModalComponent } from "./eventModal/modal.component";
import { eventResolver } from "./event-details/event-resolver.service";


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