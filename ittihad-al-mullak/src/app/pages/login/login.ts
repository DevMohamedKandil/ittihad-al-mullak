import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Building2, Phone, Lock, LogIn, MessageSquare, Mail } from 'lucide-angular';
import { AuthService } from '../../core/auth.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { BuildingIllustration } from '../../shared/building-illustration';

type LoginMode = 'password' | 'otp-request' | 'otp-verify';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideAngularModule, TranslatePipe, BuildingIllustration],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    building2: Building2,
    phone: Phone,
    lock: Lock,
    logIn: LogIn,
    sms: MessageSquare,
    email: Mail,
  };

  protected readonly mode = signal<LoginMode>('password');
  protected readonly phone = signal('');
  protected readonly password = signal('');
  protected readonly otpChannel = signal<'Sms' | 'Email'>('Sms');
  protected readonly otpCode = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected submit(): void {
    if (!this.phone() || !this.password() || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.phone(), this.password()).subscribe({
      next: () => this.auth.homeRoute().then((url) => this.router.navigateByUrl(url)),
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.title ?? this.i18n.t('login.connectionFailed'));
        this.loading.set(false);
      },
    });
  }

  protected switchToOtp(): void {
    this.mode.set('otp-request');
    this.error.set(null);
  }

  protected switchToPassword(): void {
    this.mode.set('password');
    this.otpCode.set('');
    this.error.set(null);
  }

  protected requestOtp(): void {
    if (!this.phone() || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);

    this.auth.requestOtp(this.phone(), this.otpChannel()).subscribe({
      next: () => {
        this.loading.set(false);
        this.mode.set('otp-verify');
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.title ?? this.i18n.t('login.connectionFailed'));
        this.loading.set(false);
      },
    });
  }

  protected verifyOtp(): void {
    if (!this.otpCode() || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);

    this.auth.verifyOtp(this.phone(), this.otpCode()).subscribe({
      next: () => this.auth.homeRoute().then((url) => this.router.navigateByUrl(url)),
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.title ?? this.i18n.t('login.connectionFailed'));
        this.loading.set(false);
      },
    });
  }

  /* اختصار للتجربة: ملء بيانات حسابات الـ demo */
  protected fillDemo(role: 'admin' | 'owner' | 'tenant'): void {
    const phones = { admin: '01000000001', owner: '01012345678', tenant: '01666777888' };
    this.phone.set(phones[role]);
    this.password.set('123456');
  }
}
