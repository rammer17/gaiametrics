import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { authInterceptor } from "./core/interceptors/authentication.interceptor";
import { NgHttpLoaderModule } from "ng-http-loader";
import { provideToastr } from "ngx-toastr";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withInterceptorsFromDi()
    ),
    importProvidersFrom(NgHttpLoaderModule.forRoot()),
    provideToastr({
      maxOpened: 6,
      autoDismiss: true,
      preventDuplicates: true,
      countDuplicates: true,
      
    }),
  ],
};
