import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SafePipe } from '../shared/pipes/safe.pipe';
import { SettingsService } from '../core/services/settings.service';
import { InvitesRoutingModule } from './invites.routing.module';
import { FilesService } from '../core/services/files.service';

@NgModule({
  imports: [InvitesRoutingModule, SharedModule, SafePipe],
  providers: [SettingsService, FilesService],
  declarations: [InvitesRoutingModule.components],
})
export class InvitesModule {}
