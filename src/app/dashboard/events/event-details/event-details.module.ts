import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { EventDetailsComponent } from "./event-details.component";
import { CardComponent } from "./card/card.component";
import { TableComponent } from "./table/table.component";
import { EntryModalComponent } from "./entryModal/modal.component";
import { DialogComponent } from "./dialog/dialog.component";
import { DataTablesModule } from "angular-datatables";
import { EntriesService } from "src/app/core/services/entries.service";
import { FamilyGroupsService } from "src/app/core/services/familyGroups.service";

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