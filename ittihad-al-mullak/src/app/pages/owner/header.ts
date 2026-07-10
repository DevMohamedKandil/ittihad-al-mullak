import { Component, computed, inject, input, signal } from '@angular/core';
import { LucideAngularModule, Bell, Building2 } from 'lucide-angular';
import { NotificationsApi } from '../../core/api.services';
import { AppNotification } from '../../core/models';

@Component({
  selector: 'app-owner-header',
  imports: [LucideAngularModule],
  template: `
    <header class="sticky top-0 z-40 bg-card border-b border-border">
      <div class="flex items-center justify-between h-16 px-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
            <lucide-angular [img]="icons.building2" [size]="20" />
          </div>
          <div>
            <h1 class="font-bold text-lg">{{ title() || 'اتحاد الملاك' }}</h1>
            <p class="text-xs text-muted-foreground">عمارة النيل - المعادي</p>
          </div>
        </div>
        <button
          type="button"
          (click)="onBellClick()"
          class="relative inline-flex items-center justify-center rounded-md h-9 w-9 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <lucide-angular [img]="icons.bell" [size]="20" />
          @if (unreadCount() > 0) {
            <span
              class="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center rounded-md border border-transparent bg-primary text-primary-foreground p-0 text-[10px] font-semibold"
            >
              {{ unreadCount() }}
            </span>
          }
        </button>
      </div>
    </header>
  `,
})
export class OwnerHeader {
  readonly title = input<string>();

  private readonly notificationsApi = inject(NotificationsApi);

  protected readonly icons = {
    bell: Bell,
    building2: Building2,
  };

  protected readonly notifications = signal<AppNotification[]>([]);
  protected readonly unreadCount = computed(
    () => this.notifications().filter((n) => !n.isRead).length,
  );

  constructor() {
    this.notificationsApi.mine().subscribe({
      next: (items) => this.notifications.set(items),
      error: () => this.notifications.set([]),
    });
  }

  protected onBellClick(): void {
    if (this.unreadCount() === 0) return;
    this.notificationsApi.markAllRead().subscribe({
      next: () =>
        this.notifications.update((items) => items.map((n) => ({ ...n, isRead: true }))),
      error: () => {},
    });
  }
}
