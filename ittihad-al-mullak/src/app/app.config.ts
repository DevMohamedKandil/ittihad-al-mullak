import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
import { loadAppConfig } from './core/app-config';
import { loadTranslations } from './core/i18n/translation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    // ngx-translate (نفس مكتبة Afzaz) — القواميس JSON في public/i18n
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
    }),
    // تحميل api-config.json ثم ملف الترجمة قبل إقلاع التطبيق
    provideAppInitializer(loadAppConfig),
    provideAppInitializer(() => loadTranslations(inject(TranslateService))),
    provideRouter(routes),
  ],
};
