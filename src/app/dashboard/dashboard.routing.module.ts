import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

const routes: Routes = [
  { 
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
      },
      {
        path: 'files',
        loadChildren: () => import('./files/files.module').then(m => m.FilesModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ] 
  }
]

@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule]
})

export class DashboardRoutingModule {
  static components = [
    DashboardComponent, 
    NavbarComponent,
    SidebarComponent
  ]
}