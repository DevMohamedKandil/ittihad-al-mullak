import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule, Building2, Phone, Lock, LogIn } from 'lucide-angular';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly icons = { building2: Building2, phone: Phone, lock: Lock, logIn: LogIn };

  protected readonly phone = signal('');
  protected readonly password = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected submit(): void {
    if (!this.phone() || !this.password() || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.phone(), this.password()).subscribe({
      next: () => this.router.navigateByUrl(this.auth.homeRoute()),
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.title ?? 'تعذر الاتصال بالخادم، حاول مرة أخرى');
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
