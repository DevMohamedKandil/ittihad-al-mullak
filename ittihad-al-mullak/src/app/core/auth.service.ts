import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, BuildingSummary, CreateBuildingRequest, User } from './models';
import { APP_CONFIG } from './app-config';
import { PermissionsService } from './permissions.service';
import { hasAnyAdminAccess } from './admin-screens';

const ACCESS_KEY = 'ittihad_access_token';
const REFRESH_KEY = 'ittihad_refresh_token';
const USER_KEY = 'ittihad_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly permissions = inject(PermissionsService);

  readonly currentUser = signal<User | null>(this.readStoredUser());

  constructor() {
    // جلسة موجودة من قبل (فتح التطبيق تاني أو عمل refresh للصفحة)؟ حمّل صلاحياتها.
    // بنأجلها لـ microtask تالي عشان لو نادينا permissions.load() هنا على طول، الطلب بيعدي
    // على authInterceptor اللي بيعمل inject(AuthService) — وإحنا لسه جوه constructor بتاعها،
    // فده بيسبب NG0200 (circular dependency) وبيفشل تحميل الصلاحيات بصمت بعد كل refresh للصفحة.
    if (this.currentUser() !== null) queueMicrotask(() => this.permissions.ensureLoaded());
  }
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'Admin');

  get accessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  login(phone: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${APP_CONFIG.apiUrl}/auth/login`, { phone, password })
      .pipe(tap((res) => this.storeSession(res)));
  }

  refresh(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${APP_CONFIG.apiUrl}/auth/refresh`, {
        refreshToken: localStorage.getItem(REFRESH_KEY),
      })
      .pipe(tap((res) => this.storeSession(res)));
  }

  logout(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.permissions.clear();
    this.router.navigate(['/login']);
  }

  /**
   * التوجيه بعد تسجيل الدخول: الأدمن دايماً للوحة الإدارة، أي دور تاني بيتوجه للوحة الإدارة
   * برضه لو عنده صلاحية View على شاشة إدارة واحدة على الأقل (ممنوحة من شاشة الصلاحيات)،
   * غير كده لتطبيق المالك العادي.
   */
  async homeRoute(): Promise<string> {
    if (this.isAdmin()) return '/admin';
    await this.permissions.ensureLoaded();
    return hasAnyAdminAccess(this.permissions) ? '/admin' : '/owner';
  }

  /** العمارات اللي المستخدم الحالي عضو فيها — لعرض مبدّل العمارة. */
  myBuildings(): Observable<BuildingSummary[]> {
    return this.http.get<BuildingSummary[]>(`${APP_CONFIG.apiUrl}/auth/my-buildings`);
  }

  /**
   * تبديل العمارة النشطة. بيعمل reload كامل للصفحة بعد النجاح عشان كل الشاشات
   * (الداشبورد، الشقق، الفواتير...) تعيد التحميل من الصفر بالعمارة الجديدة —
   * أغلبها بيجيب بياناته مرة واحدة بس عند التحميل ومش هيلاحظ تغيير التوكن لوحده.
   */
  switchBuilding(buildingId: number): void {
    this.http
      .post<AuthResponse>(`${APP_CONFIG.apiUrl}/auth/switch-building`, { buildingId })
      .subscribe((res) => {
        this.storeSession(res);
        window.location.href = '/admin';
      });
  }

  /** تسجيل عمارة جديدة يديرها نفس حساب الأدمن، ويتم التنقل لها فوراً. */
  createBuilding(request: CreateBuildingRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${APP_CONFIG.apiUrl}/auth/buildings`, request).pipe(
      tap((res) => {
        this.storeSession(res);
        window.location.href = '/admin';
      }),
    );
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem(ACCESS_KEY, res.accessToken);
    localStorage.setItem(REFRESH_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
    this.permissions.load();
  }

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
