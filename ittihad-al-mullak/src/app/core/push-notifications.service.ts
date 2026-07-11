import { Injectable, effect, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { AuthService } from './auth.service';

/**
 * تسجيل توكن الإشعارات الحقيقي عند تشغيل التطبيق كتطبيق موبايل (Capacitor) —
 * بدون أي تأثير في المتصفح العادي (Capacitor.isNativePlatform() بترجع false هناك).
 */
@Injectable({ providedIn: 'root' })
export class PushNotificationsService {
  private readonly auth = inject(AuthService);
  private initialized = false;
  private pendingToken: string | null = null;

  constructor() {
    // لو التوكن وصل قبل ما المستخدم يسجّل دخول، سجّله أول ما الجلسة تتفعّل
    effect(() => {
      if (this.auth.isLoggedIn() && this.pendingToken) {
        const token = this.pendingToken;
        this.pendingToken = null;
        this.auth.registerDevice(token, Capacitor.getPlatform()).subscribe();
      }
    });
  }

  init(): void {
    if (this.initialized || !Capacitor.isNativePlatform()) return;
    this.initialized = true;

    PushNotifications.addListener('registration', (token) => {
      if (this.auth.isLoggedIn()) {
        this.auth.registerDevice(token.value, Capacitor.getPlatform()).subscribe();
      } else {
        this.pendingToken = token.value;
      }
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('[Push] registration error', err);
    });

    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') PushNotifications.register();
    });
  }
}
