import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from './app-config';

/**
 * صلاحيات المستخدم الحالي — بتتحمل من /auth/my-permissions بعد تسجيل الدخول،
 * والواجهة بتخفي الأزرار بيها عن طريق directive الـ *hasPermission.
 * (الإخفاء تجميلي — الحماية الفعلية في السيرفر بـ [HasPermission])
 */
@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly http = inject(HttpClient);
  private readonly keys = signal<ReadonlySet<string>>(new Set());
  readonly loaded = signal(false);

  readonly all = computed(() => this.keys());

  has(permissionKey: string): boolean {
    return this.keys().has(permissionKey);
  }

  /** بتتنادى بعد اللوجين وعند فتح التطبيق بجلسة موجودة */
  load(): void {
    this.http.get<string[]>(`${APP_CONFIG.apiUrl}/auth/my-permissions`).subscribe({
      next: (permissionKeys) => {
        this.keys.set(new Set(permissionKeys));
        this.loaded.set(true);
      },
      error: () => this.loaded.set(true),
    });
  }

  clear(): void {
    this.keys.set(new Set());
    this.loaded.set(false);
  }
}
