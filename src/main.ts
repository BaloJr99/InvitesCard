/// <reference types="@angular/localize" />

import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing-module';
import { CoreModule } from './app/core/core.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, CoreModule, ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
        })),
        provideAnimations()
    ]
})
  .catch((err) => console.error(err));
