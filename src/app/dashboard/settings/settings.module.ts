import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { SettingsComponent } from "./settings.component";
import { EventsService } from "src/core/services/events.service";
import { SettingsService } from "src/core/services/settings.service";

const routes: Routes = [
  { 
    path: '',
    component: SettingsComponent
  }
]

@NgModule({
  providers: [
    EventsService,
    SettingsService
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SettingsComponent,
  ]
})

export class SettingsModule {

}