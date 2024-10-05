import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { CoreModule } from './core/core.module';
import { CommonModalComponent } from './shared/components/common-modal/common-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    CommonModalComponent,
    SpinnerComponent,
    ErrorModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
