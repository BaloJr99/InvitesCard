import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EnsureModuleLoadedOnceGuard } from './guards/ensure-module-loaded-once.guard';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

@NgModule({
  providers: [
    { provide: 'Window', useFactory: () => window },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    provideHttpClient(withInterceptorsFromDi()),
  ], // these should be singleton
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  // Ensure that CoreModule is only loaded into AppModule
  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
