import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { EventsService } from 'src/app/core/services/events.service';
import { UsersService } from 'src/app/core/services/users.service';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';
import { EventModalComponent } from './event-modal/event-modal.component';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';

const routes: Routes = [
  {
    path: '',
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
  providers: [EventsService, UsersService],
  imports: [
    SharedModule,
    DateFormatPipe,
    RouterModule.forChild(routes),
    ValidationPipe,
    ValidationErrorPipe,
  ],
  declarations: [EventsComponent, EventModalComponent],
})
export class EventsModule {}
