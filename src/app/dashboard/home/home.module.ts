import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { EventsService } from 'src/app/core/services/events.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  providers: [EventsService],
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [HomeComponent],
})
export class HomeModule {}
