import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailsComponent } from './event-details.component';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { InvitesImportModalComponent } from './invites-import-modal/invites-import-modal.component';
import { EventCardComponent } from './event-card/event-card.component';
import { InviteModalComponent } from './invite-modal/invite-modal.component';
import { InviteGroupComponent } from './invite-modal/invite-group-modal/invite-group.component';
import { eventResolver } from './event-resolver.service';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';

const routes: Routes = [
  {
    path: '',
    component: EventDetailsComponent,
    resolve: { eventResolved: eventResolver },
  },
];

@NgModule({
  providers: [InvitesService, InviteGroupsService],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ValidationPipe,
    ValidationErrorPipe,
  ],
  declarations: [
    EventDetailsComponent,
    EventCardComponent,
    InvitesImportModalComponent,
    InviteModalComponent,
    InviteGroupComponent,
  ],
})
export class EventDetailsModule {}
