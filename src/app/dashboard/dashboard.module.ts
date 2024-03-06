import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { SharedModule } from "../shared/shared.module";
import { DataTablesModule } from "angular-datatables";
import { UpdateEntryService } from "./update-entry.service";
import { SocketService } from "src/core/services/socket.service";
import { UpdateEventService } from "./update-event.service";

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    DataTablesModule
  ],
  providers: [
    UpdateEntryService,
    UpdateEventService,
    SocketService
  ],
  declarations: [DashboardRoutingModule.components]
})

export class DashboardModule { }