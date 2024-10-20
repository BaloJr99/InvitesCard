import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from './files.component';
import { EventsService } from 'src/app/core/services/events.service';
import { FilesService } from 'src/app/core/services/files.service';

const routes: Routes = [
  {
    path: '',
    component: FilesComponent,
  },
];

@NgModule({
  providers: [EventsService, FilesService],
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [FilesComponent],
})
export class FilesModule {}
