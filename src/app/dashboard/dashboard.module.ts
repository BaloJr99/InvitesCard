import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { SharedModule } from "../shared/shared.module";
import { DataTablesModule } from "angular-datatables";
import { ModalComponent } from './modal/modal.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    DataTablesModule
  ],
  declarations: [DashboardRoutingModule.components, ModalComponent]
})

export class DashboardModule { }