import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { UsersComponent } from "./users.component";
import { EventsService } from "src/core/services/events.service";
import { SettingsService } from "src/core/services/settings.service";
import { DataTablesModule } from "angular-datatables";
import { UsersService } from "src/core/services/users.service";
import { UserModalComponent } from "./usersModal/modal.component";
import { RolesService } from "src/core/services/roles.service";

const routes: Routes = [
  { 
    path: '',
    component: UsersComponent
  }
]

@NgModule({
  providers: [
    EventsService,
    SettingsService,
    UsersService,
    RolesService
  ],
  imports: [
    DataTablesModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UsersComponent,
    UserModalComponent
  ]
})

export class UsersModule {

}