import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { CardComponent } from "./card/card.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { TableComponent } from "./table/table.component";
import { ModalComponent } from "./modal/modal.component";
import { DialogComponent } from "./dialog/dialog.component";

const routes: Routes = [
  { 
    path: '',
    component: DashboardComponent
  },
  {
    path: '**',
    redirectTo: '/error/page-not-found'
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
    SidebarComponent, 
    CardComponent, 
    TableComponent,
    ModalComponent,
    DialogComponent
  ]
}