import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from './models';
import { APP_CONFIG } from './app-config';

const ACCESS_KEY = 'ittihad_access_token';
const REFRESH_KEY = 'ittihad_refresh_token';
const USER_KEY = 'ittihad_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly currentUser = signal<User | null>(this.readStoredUser());
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
    this.router.navigate(['/login']);
  }

  /* التوجيه بعد تسجيل الدخول حسب الدور */
  homeRoute(): string {
    return this.isAdmin() ? '/admin' : '/owner';
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem(ACCESS_KEY, res.accessToken);
    localStorage.setItem(REFRESH_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
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
