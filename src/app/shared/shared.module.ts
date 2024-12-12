import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared.routing.module';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TableComponent } from './components/table/table.component';
import { FilterComponent } from './components/table/filter/filter.component';

@NgModule({
  imports: [CommonModule, SharedRoutingModule],
  exports: [CommonModule, ReactiveFormsModule, TableComponent, FilterComponent],
  declarations: [NotAuthorizedComponent, PageNotFoundComponent, TableComponent, FilterComponent],
})
export class SharedModule {}
