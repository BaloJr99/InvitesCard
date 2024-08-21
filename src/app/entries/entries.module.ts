import { NgModule } from '@angular/core';
import { EntriesRoutingModule } from './entries.routing.module';
import { SharedModule } from '../shared/shared.module';
import { SafePipe } from '../shared/pipes/safe.pipe';
import { SocketService } from '../core/services/socket.service';
import { SettingsService } from '../core/services/settings.service';
import { ImagesService } from '../core/services/images.service';

@NgModule({
  imports: [
    EntriesRoutingModule,
    SharedModule,
    SafePipe
  ],
  providers: [
    SocketService,
    SettingsService,
    ImagesService
  ],
  declarations: [EntriesRoutingModule.components]
})
export class EntriesModule { }
