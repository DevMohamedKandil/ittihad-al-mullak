import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
import { loadAppConfig } from './core/app-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // تحميل api-config.json قبل إقلاع التطبيق (نمط Afzaz) — عنوان الـ API قابل للتغيير بدون build
    provideAppInitializer(loadAppConfig),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
