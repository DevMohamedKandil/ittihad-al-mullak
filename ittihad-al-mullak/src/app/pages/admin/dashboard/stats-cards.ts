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
}

@Component({
  selector: 'app-stats-cards',
  imports: [LucideAngularModule],
  template: `
    @if (error()) {
      <p class="text-sm text-destructive">{{ error() }}</p>
    }
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      @for (stat of stats(); track stat.title) {
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="space-y-2">
                <p class="text-sm text-muted-foreground">{{ stat.title }}</p>
                <p class="text-2xl font-bold">{{ stat.value }}</p>
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
              <div class="flex items-center justify-center w-12 h-12 rounded-xl" [class]="stat.iconBg">
                <lucide-angular [img]="stat.icon" [size]="24" [class]="stat.iconClass" />
              </div>
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
            iconBg: 'bg-primary/10',
          },
          {
            title: this.i18n.t('dashboard.totalExpenses'),
            value: formatCurrency(data.totalExpenses),
            change: this.i18n.t('dashboard.totalExpensesHint'),
            trend: 'neutral',
            icon: Receipt,
            iconClass: 'text-success',
            iconBg: 'bg-success/10',
          },
          {
            title: this.i18n.t('nav.maintenance'),
            value: `${data.maintenanceCount}`,
            change: this.i18n.t('dashboard.newRequests', { count: data.newMaintenanceCount }),
            trend: 'neutral',
            icon: Wrench,
            iconClass: 'text-warning',
            iconBg: 'bg-warning/10',
          },
          {
            title: this.i18n.t('dashboard.residentsCount'),
            value: `${data.residentsCount}`,
            change: this.i18n.t('dashboard.inApartments', { count: data.apartmentsCount }),
            trend: 'neutral',
            icon: Users,
            iconClass: 'text-primary',
            iconBg: 'bg-primary/10',
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
