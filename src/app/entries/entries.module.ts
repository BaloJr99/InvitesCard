import { NgModule } from '@angular/core';
import { EntriesRoutingModule } from './entries.routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    EntriesRoutingModule,
    SharedModule
  ],
  declarations: [EntriesRoutingModule.components]
})
export class EntriesModule { }
