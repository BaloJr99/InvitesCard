import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SafePipe } from '../shared/pipes/safe.pipe';
import { SettingsService } from '../core/services/settings.service';
import { ImagesService } from '../core/services/images.service';
import { InvitesRoutingModule } from './invites.routing.module';

@NgModule({
  imports: [InvitesRoutingModule, SharedModule, SafePipe],
  providers: [SettingsService, ImagesService],
  declarations: [InvitesRoutingModule.components],
})
export class InvitesModule {}
