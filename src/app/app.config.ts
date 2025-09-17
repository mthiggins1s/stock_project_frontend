// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TokenInterceptor } from './core/interceptors/token-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // ✅ pull from DI
    {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
},
    provideAnimations(),
    importProvidersFrom(FormsModule)
  ]
};
