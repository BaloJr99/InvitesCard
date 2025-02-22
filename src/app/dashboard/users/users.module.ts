import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { EventsService } from 'src/app/core/services/events.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { UsersService } from 'src/app/core/services/users.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { UserModalComponent } from './user-modal/user-modal.component';
import { UsersComponent } from './users.component';
import { UserRoleComponent } from './user-role-modal/user-role.component';
import { ValidationErrorPipe } from '../../shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';

const routes: Routes = [
  {
    path: '',
    title: 'InvitesMX -- Users',
    component: UsersComponent,
  },
];

@NgModule({
  providers: [EventsService, SettingsService, UsersService, RolesService],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ValidationPipe,
    ValidationErrorPipe,
  ],
  declarations: [UsersComponent, UserModalComponent, UserRoleComponent],
})
export class UsersModule {}
