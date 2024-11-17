import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailsComponent } from './event-details.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { DataTablesModule } from 'angular-datatables';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { InvitesImportModalComponent } from './invites-import-modal/invites-import-modal.component';
import { EventCardComponent } from './event-card/event-card.component';
import { InviteModalComponent } from './invite-modal/invite-modal.component';
import { InviteGroupComponent } from './invite-modal/invite-group-modal/invite-group.component';
import { eventResolver } from './event-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: EventDetailsComponent,
    resolve: { eventResolved: eventResolver },
  },
];

@NgModule({
  providers: [InvitesService, InviteGroupsService],
  imports: [DataTablesModule, SharedModule, RouterModule.forChild(routes)],
  declarations: [
    EventDetailsComponent,
    EventCardComponent,
    TableComponent,
    InvitesImportModalComponent,
    InviteModalComponent,
    InviteGroupComponent,
  ],
})
export class EventDetailsModule {}
