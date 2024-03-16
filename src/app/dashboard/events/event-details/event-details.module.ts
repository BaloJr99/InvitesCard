import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { EventDetailsComponent } from "./event-details.component";
import { EntriesService } from "src/core/services/entries.service";
import { CardComponent } from "./card/card.component";
import { TableComponent } from "./table/table.component";
import { EntryModalComponent } from "./entryModal/modal.component";
import { DialogComponent } from "./dialog/dialog.component";
import { FamilyGroupsService } from "src/core/services/familyGroups.service";
import { DataTablesModule } from "angular-datatables";

const routes: Routes = [
  { 
    path: '',
    component: EventDetailsComponent
  }
]

@NgModule({
  providers: [
    EntriesService,
    FamilyGroupsService
  ],
  imports: [
    DataTablesModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    EventDetailsComponent,
    CardComponent,
    TableComponent,
    EntryModalComponent,
    DialogComponent
  ]
})

export class EventDetailsModule { }