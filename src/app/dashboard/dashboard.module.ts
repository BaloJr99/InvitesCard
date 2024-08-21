import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { SharedModule } from "../shared/shared.module";
import { SocketService } from "../core/services/socket.service";
import { CommonEntriesService } from "../core/services/commonEntries.service";

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule
  ],
  providers: [
    SocketService,
    CommonEntriesService
  ],
  declarations: [DashboardRoutingModule.components ]
})

export class DashboardModule { }