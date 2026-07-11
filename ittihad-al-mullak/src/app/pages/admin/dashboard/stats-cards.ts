import { Component, OnInit, inject, signal } from '@angular/core';
import {
  LucideAngularModule,
  LucideIconData,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Wrench,
  Users,
} from 'lucide-angular';
import { DashboardApi } from '../../../core/api.services';
import { formatCurrency } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIconData;
  iconClass: string;
  iconBg: string;
  accent: string;
  /** موجودة بس لكارت نسبة التحصيل — بيرسم حلقة تقدّم بدل الأيقونة */
  progress?: number;
}

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

@Component({
  selector: 'app-stats-cards',
  imports: [LucideAngularModule],
  template: `
    @if (error()) {
      <p class="text-sm text-destructive">{{ error() }}</p>
    }
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      @for (stat of stats(); track stat.title) {
        <div class="group overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div class="h-1.5" [class]="stat.accent"></div>
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="space-y-2">
                <p class="text-sm text-muted-foreground">{{ stat.title }}</p>
                <p class="text-3xl font-bold tabular-nums">{{ stat.value }}</p>
                <div class="flex items-center gap-1">
                  @if (stat.trend === 'up') {
                    <lucide-angular [img]="trendingUpIcon" [size]="16" class="text-success" />
                  }
                  @if (stat.trend === 'down') {
                    <lucide-angular [img]="trendingDownIcon" [size]="16" class="text-destructive" />
                  }
                  <span
                    class="text-sm"
                    [class.text-success]="stat.trend === 'up'"
                    [class.text-destructive]="stat.trend === 'down'"
                    [class.text-muted-foreground]="stat.trend === 'neutral'"
                  >
                    {{ stat.change }}
                  </span>
                </div>
              </div>

              @if (stat.progress !== undefined) {
                <svg viewBox="0 0 64 64" class="w-14 h-14 -rotate-90 flex-shrink-0">
                  <circle cx="32" cy="32" [attr.r]="ringRadius" fill="none" stroke="currentColor" stroke-width="7" class="text-primary/15" />
                  <circle
                    cx="32" cy="32" [attr.r]="ringRadius" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"
                    class="text-primary transition-all duration-700"
                    [attr.stroke-dasharray]="ringCircumference"
                    [attr.stroke-dashoffset]="ringCircumference * (1 - stat.progress / 100)"
                  />
                </svg>
              } @else {
                <div
                  class="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 transition-transform group-hover:scale-105"
                  [class]="stat.iconBg"
                >
                  <lucide-angular [img]="stat.icon" [size]="24" [class]="stat.iconClass" />
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class StatsCards implements OnInit {
  private readonly dashboardApi = inject(DashboardApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly trendingUpIcon = TrendingUp;
  protected readonly trendingDownIcon = TrendingDown;
  protected readonly ringRadius = RING_RADIUS;
  protected readonly ringCircumference = RING_CIRCUMFERENCE;

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly stats = signal<Stat[]>([]);

  ngOnInit(): void {
    this.dashboardApi.stats().subscribe({
      next: (data) => {
        this.stats.set([
          {
            title: this.i18n.t('dashboard.collectionRate'),
            value: `${data.collectionRate}%`,
            change: this.i18n.t('dashboard.collectionRateHint'),
            trend: 'up',
            icon: Wallet,
            iconClass: 'text-primary',
            iconBg: 'bg-gradient-to-br from-primary/20 to-primary/5',
            accent: 'bg-gradient-to-l from-primary to-primary/40',
            progress: data.collectionRate,
          },
          {
            title: this.i18n.t('dashboard.totalExpenses'),
            value: formatCurrency(data.totalExpenses),
            change: this.i18n.t('dashboard.totalExpensesHint'),
            trend: 'neutral',
            icon: Receipt,
            iconClass: 'text-success',
            iconBg: 'bg-gradient-to-br from-success/20 to-success/5',
            accent: 'bg-gradient-to-l from-success to-success/40',
          },
          {
            title: this.i18n.t('nav.maintenance'),
            value: `${data.maintenanceCount}`,
            change: this.i18n.t('dashboard.newRequests', { count: data.newMaintenanceCount }),
            trend: 'neutral',
            icon: Wrench,
            iconClass: 'text-warning',
            iconBg: 'bg-gradient-to-br from-warning/25 to-warning/5',
            accent: 'bg-gradient-to-l from-warning to-warning/40',
          },
          {
            title: this.i18n.t('dashboard.residentsCount'),
            value: `${data.residentsCount}`,
            change: this.i18n.t('dashboard.inApartments', { count: data.apartmentsCount }),
            trend: 'neutral',
            icon: Users,
            iconClass: 'text-secondary',
            iconBg: 'bg-gradient-to-br from-secondary/20 to-secondary/5',
            accent: 'bg-gradient-to-l from-secondary to-secondary/40',
          },
        ]);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
        this.loading.set(false);
      },
    });
  }
}
