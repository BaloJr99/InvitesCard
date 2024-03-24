import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { FilesComponent } from "./files.component";
import { EventsService } from "src/core/services/events.service";
import { ImagesService } from "src/core/services/images.service";
import { DialogComponent } from "./dialog/dialog.component";

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
    DialogComponent
  ]
})

export class FilesModule {

}