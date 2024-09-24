import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { EventsService } from 'src/app/core/services/events.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { UsersService } from 'src/app/core/services/users.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { UserModalComponent } from './userModal/user-modal.component';
import { UsersComponent } from './users.component';
import { UserRoleComponent } from './userRoleModal/user-role.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
];

@NgModule({
  providers: [EventsService, SettingsService, UsersService, RolesService],
  imports: [DataTablesModule, SharedModule, RouterModule.forChild(routes)],
  declarations: [UsersComponent, UserModalComponent, UserRoleComponent],
})
export class UsersModule {}
