import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { SharedModule } from "../shared/shared.module";
import { SocketService } from "src/core/services/socket.service";
import { CommonEntriesService } from "src/core/services/commonEntries.service";

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