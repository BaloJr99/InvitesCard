import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { SharedModule } from "../shared/shared.module";
import { DataTablesModule } from "angular-datatables";
import { SocketService } from "src/core/services/socket.service";
import { EventsService } from "src/core/services/events.service";
import { FamilyGroupsService } from "src/core/services/familyGroups.service";

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    DataTablesModule
  ],
  providers: [
    SocketService,
    EventsService,
    FamilyGroupsService
  ],
  declarations: [DashboardRoutingModule.components]
})

export class DashboardModule { }