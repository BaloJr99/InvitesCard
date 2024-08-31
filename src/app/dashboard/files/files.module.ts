import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { FilesComponent } from "./files.component";
import { FilesModalComponent } from "./filesModal/files-modal.component";
import { EventsService } from "src/app/core/services/events.service";
import { ImagesService } from "src/app/core/services/images.service";

const routes: Routes = [
  { 
    path: '',
    component: FilesComponent
  }
]

@NgModule({
  providers: [
    EventsService,
    ImagesService
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    FilesComponent,
    FilesModalComponent
  ]
})

export class FilesModule {

}