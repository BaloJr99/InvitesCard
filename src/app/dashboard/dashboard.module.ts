import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { SharedModule } from "../shared/shared.module";
import { DataTablesModule } from "angular-datatables";
import { SocketService } from "src/core/services/socket.service";

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    DataTablesModule
  ],
  providers: [
    SocketService
  ],
  declarations: [DashboardRoutingModule.components]
})

export class DashboardModule { }