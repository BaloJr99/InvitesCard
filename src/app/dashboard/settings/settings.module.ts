import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { EventsService } from 'src/app/core/services/events.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SweetXvSettingsComponent } from './sweet-xv-settings/sweet-xv-settings.component';
import { SaveTheDateSettingsComponent } from './save-the-date-settings/save-the-date-settings.component';
import { WeddingSettingsComponent } from './wedding-settings/wedding-settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
  },
];

@NgModule({
  providers: [EventsService, SettingsService],
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [
    SettingsComponent,
    SweetXvSettingsComponent,
    SaveTheDateSettingsComponent,
    WeddingSettingsComponent,
  ],
})
export class SettingsModule {}
