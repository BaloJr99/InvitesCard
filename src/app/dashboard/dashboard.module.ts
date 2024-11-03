import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { SharedModule } from '../shared/shared.module';
import { CommonInvitesService } from '../core/services/commonInvites.service';
import { FileReaderService } from '../core/services/fileReader.service';

@NgModule({
  imports: [DashboardRoutingModule, SharedModule],
  providers: [CommonInvitesService, FileReaderService],
  declarations: [DashboardRoutingModule.components],
})
export class DashboardModule {}
