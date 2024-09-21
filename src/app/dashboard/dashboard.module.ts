import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { SharedModule } from '../shared/shared.module';
import { CommonInvitesService } from '../core/services/commonInvites.service';

@NgModule({
  imports: [DashboardRoutingModule, SharedModule],
  providers: [CommonInvitesService],
  declarations: [DashboardRoutingModule.components],
})
export class DashboardModule {}
