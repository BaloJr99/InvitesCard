import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared.routing.module';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

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
