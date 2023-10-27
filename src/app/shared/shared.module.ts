import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { SharedRoutingModule } from './shared.routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [ CommonModule, ReactiveFormsModule],
  declarations: [
    NotAuthorizedComponent,
    PageNotFoundComponent
  ],
})
export class SharedModule { }
