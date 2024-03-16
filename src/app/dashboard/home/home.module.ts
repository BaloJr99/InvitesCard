import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { HomeComponent } from "./home.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { 
    path: '',
    component: HomeComponent
  }
]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HomeComponent
  ]
})

export class HomeModule {

}