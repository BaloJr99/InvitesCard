import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { InviteDetailsComponent } from './event-details.component';
import { TableComponent } from './table/table.component';
import { DataTablesModule } from 'angular-datatables';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { InvitesImportModalComponent } from './invitesImportModal/invites-import-modal.component';
import { EventCardComponent } from './eventCard/event-card.component';
import { InviteModalComponent } from './inviteModal/invite-modal.component';
import { EventDialogComponent } from './eventDialog/event-dialog.component';
import { InviteGroupComponent } from './inviteModal/inviteGroupModal/invite-group.component';

const routes: Routes = [
  {
    path: '',
    component: InviteDetailsComponent,
  },
];

@NgModule({
  providers: [InvitesService, InviteGroupsService],
  imports: [DataTablesModule, SharedModule, RouterModule.forChild(routes)],
  declarations: [
    InviteDetailsComponent,
    EventCardComponent,
    TableComponent,
    InvitesImportModalComponent,
    InviteModalComponent,
    EventDialogComponent,
    InviteGroupComponent,
  ],
})
export class EventDetailsModule {}
