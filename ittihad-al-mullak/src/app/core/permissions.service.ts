import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { APP_CONFIG } from './app-config';

/**
 * صلاحيات المستخدم الحالي — بتتحمل من /auth/my-permissions بعد تسجيل الدخول.
 * بتستخدم في مكانين:
 *  1) route guards (core/guards.ts) — تحديد هل المستخدم يقدر يدخل شاشة معينة
 *  2) الواجهة (*hasPermission وفلترة السايدبار) — إخفاء الأزرار/الروابط
 * الحماية الفعلية دايماً في السيرفر بـ [HasPermission] — ده بس تحكّم في العرض.
 */
@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly http = inject(HttpClient);
  private readonly keys = signal<ReadonlySet<string>>(new Set());
  readonly loaded = signal(false);

  readonly all = computed(() => this.keys());

  private loadPromise: Promise<void> | null = null;

  has(permissionKey: string): boolean {
    return this.keys().has(permissionKey);
  }

  /** بتتنادى بعد اللوجين وعند فتح التطبيق بجلسة موجودة */
  load(): void {
    this.loadPromise = firstValueFrom(this.http.get<string[]>(`${APP_CONFIG.apiUrl}/auth/my-permissions`))
      .then((permissionKeys) => {
        this.keys.set(new Set(permissionKeys));
        this.loaded.set(true);
      })
      .catch(() => {
        this.loaded.set(true);
      });
  }

  /** بينتظر الـ guards عليها قبل ما تقرر — بتتأكد إن الصلاحيات اتحملت قبل أي قرار دخول */
  async ensureLoaded(): Promise<void> {
    if (!this.loadPromise) this.load();
    await this.loadPromise;
  }

  clear(): void {
    this.keys.set(new Set());
    this.loaded.set(false);
    this.loadPromise = null;
  }
}
