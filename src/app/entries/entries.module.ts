import { NgModule } from '@angular/core';
import { EntriesRoutingModule } from './entries.routing.module';
import { SharedModule } from '../shared/shared.module';
import { SocketService } from 'src/core/services/socket.service';

@NgModule({
  imports: [
    EntriesRoutingModule,
    SharedModule
  ],
  providers: [
    SocketService
  ],
  declarations: [EntriesRoutingModule.components]
})
export class EntriesModule { }
