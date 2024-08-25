import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { InviteDetailsComponent } from "./event-details.component";
import { CardComponent } from "./card/card.component";
import { TableComponent } from "./table/table.component";
import { DialogComponent } from "./dialog/dialog.component";
import { DataTablesModule } from "angular-datatables";
import { FamilyGroupsService } from "src/app/core/services/familyGroups.service";
import { InvitesService } from "src/app/core/services/invites.service";
import { InvitesImportModalComponent } from "./invitesImportModal/invites-import-modal.component";
import { InvitesModalComponent } from "./invitesModal/modal.component";

const routes: Routes = [
  { 
    path: '',
    component: InviteDetailsComponent
  }
]

@NgModule({
  providers: [
    InvitesService,
    FamilyGroupsService
  ],
  imports: [
    DataTablesModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    InviteDetailsComponent,
    CardComponent,
    TableComponent,
    InvitesImportModalComponent,
    InvitesModalComponent,
    DialogComponent
  ]
})

export class EventDetailsModule { }