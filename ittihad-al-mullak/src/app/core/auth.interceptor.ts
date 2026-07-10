import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { TranslationService } from './i18n/translation.service';

/**
 * بيحط التوكن + لغة الواجهة (Accept-Language) على كل طلب،
 * ولو رجع 401 بيجرب يجدد الجلسة بالـ refresh token مرة واحدة — لو فشلت بيسجل خروج.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const i18n = inject(TranslationService);

  const withToken = (token: string | null) =>
    req.clone({
      setHeaders: {
        'Accept-Language': i18n.language(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  const isAuthCall = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

  return next(withToken(auth.accessToken)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isAuthCall || !auth.accessToken) {
        return throwError(() => error);
      }
      return auth.refresh().pipe(
        switchMap((res) => next(withToken(res.accessToken))),
        catchError((refreshError) => {
          auth.logout();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
