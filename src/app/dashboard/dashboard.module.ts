import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { SharedModule } from "../shared/shared.module";
import { DataTablesModule } from "angular-datatables";
import { UpdateEntryService } from "./update-entry.service";

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    DataTablesModule
  ],
  providers: [
    UpdateEntryService
  ],
  declarations: [DashboardRoutingModule.components]
})

export class DashboardModule { }