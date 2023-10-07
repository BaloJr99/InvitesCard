import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { EntriesComponent } from "./entries.component";
import { CountdownComponent } from '../countdown/countdown.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

const routes: Routes = [
  {
    path: '',
    component: EntriesComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntriesRoutingModule {
  static components = [EntriesComponent, CountdownComponent, ConfirmationComponent, ];
}