import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared.routing.module';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  imports: [CommonModule, SharedRoutingModule],
  exports: [CommonModule, ReactiveFormsModule, TableComponent],
  declarations: [NotAuthorizedComponent, PageNotFoundComponent, TableComponent],
})
export class SharedModule {}
