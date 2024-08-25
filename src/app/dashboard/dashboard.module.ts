import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard.routing.module";
import { SharedModule } from "../shared/shared.module";
import { SocketService } from "../core/services/socket.service";
import { CommonInvitesService } from "../core/services/commonInvites.service";

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule
  ],
  providers: [
    SocketService,
    CommonInvitesService
  ],
  declarations: [DashboardRoutingModule.components ]
})

export class DashboardModule { }