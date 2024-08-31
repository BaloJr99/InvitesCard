import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { LogsComponent } from "./logs.component";
import { LoggerService } from "src/app/core/services/logger.service";
import { DataTablesModule } from "angular-datatables";
import { LogsModalComponent } from "./logsModal/logs-modal.component";

const routes: Routes = [
  { 
    path: '',
    component: LogsComponent
  }
]

@NgModule({
  providers: [
    LoggerService
  ],
  imports: [
    DataTablesModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LogsComponent,
    LogsModalComponent
  ]
})

export class LoggerModule {

}