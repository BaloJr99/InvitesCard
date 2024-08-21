import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { EntriesComponent } from "./entries.component";
import { CountdownComponent } from './countdown/countdown.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { entriesResolver } from './entries-resolver.service';

const routes: Routes = [
  {
    path: ':id',
    component: EntriesComponent,
    resolve: { entry: entriesResolver }
  }, 
  { path: '', pathMatch: 'full', redirectTo: '/auth/login' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntriesRoutingModule {
  static components = [EntriesComponent, CountdownComponent, ConfirmationComponent, ];
}