import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { SharedModule } from "../shared/shared.module";
import { DataTablesModule } from "angular-datatables";

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    DataTablesModule
  ],
  declarations: [DashboardRoutingModule.components]
})

export class DashboardModule { }