import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Download } from 'lucide-angular';
import { StatsCards } from './stats-cards';
import { CollectionChart } from './collection-chart';
import { ApartmentsTable } from './apartments-table';
import { MaintenanceList } from './maintenance-list';
import { AnnouncementsCard } from './announcements-card';
import { ApartmentsApi } from '../../../core/api.services';
import { AuthService } from '../../../core/auth.service';
import { downloadCsv, formatFullDate } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    LucideAngularModule,
    RouterLink,
    TranslatePipe,
    StatsCards,
    CollectionChart,
    ApartmentsTable,
    MaintenanceList,
    AnnouncementsCard,
  ],
  template: `
    <div class="space-y-6">
      <!-- Hero -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary to-secondary p-6 sm:p-8 text-primary-foreground shadow-lg">
        <div
          class="pointer-events-none absolute inset-0 opacity-[0.12]"
          style="background-image: radial-gradient(circle at 15% 25%, white, transparent 32%), radial-gradient(circle at 85% 70%, white, transparent 28%)"
        ></div>
        <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p class="text-sm text-primary-foreground/80">{{ 'dashboard.greeting' | translate }} {{ userName() }}</p>
            <h1 class="text-2xl sm:text-3xl font-bold mt-1">{{ 'nav.dashboard' | translate }}</h1>
            <p class="text-sm text-primary-foreground/70 mt-1">{{ today }}</p>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              (click)="exportReport()"
              [disabled]="exporting()"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-3.5 bg-white/10 text-primary-foreground border border-white/20 backdrop-blur-sm hover:bg-white/20 disabled:opacity-50"
            >
              <lucide-angular [img]="downloadIcon" [size]="16" />
              {{ 'dashboard.exportReport' | translate }}
            </button>
            <button
              type="button"
              routerLink="/admin/invoices"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-9 px-3.5 bg-white text-primary shadow-sm hover:bg-white/90"
            >
              <lucide-angular [img]="plusIcon" [size]="16" />
              {{ 'dashboard.addInvoice' | translate }}
            </button>
          </div>
        </div>
      </div>

      @if (error()) {
        <p class="text-sm text-destructive">{{ error() }}</p>
      }

      <!-- Stats Cards -->
      <app-stats-cards />

      <!-- Charts -->
      <app-collection-chart />

      <!-- Main Content Grid -->
      <div class="grid gap-6 lg:grid-cols-5 items-start">
        <div class="lg:col-span-3">
          <app-apartments-table />
        </div>
        <div class="lg:col-span-2 space-y-6">
          <app-maintenance-list />
          <app-announcements-card />
        </div>
      </div>
    </div>
  `,
})
export class Dashboard {
  private readonly apartmentsApi = inject(ApartmentsApi);
  private readonly auth = inject(AuthService);
  protected readonly i18n = inject(TranslationService);

  protected readonly plusIcon = Plus;
  protected readonly downloadIcon = Download;

  protected readonly userName = computed(() => this.auth.currentUser()?.name ?? '');
  protected readonly today = formatFullDate();

  protected readonly exporting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected exportReport(): void {
    this.exporting.set(true);
    this.apartmentsApi.list().subscribe({
      next: (apartments) => {
        downloadCsv(
          'report.csv',
          [
            this.i18n.t('apartments.number'),
            this.i18n.t('apartments.floor'),
            this.i18n.t('apartments.owner'),
            this.i18n.t('apartments.phone'),
            this.i18n.t('apartments.tenant'),
            this.i18n.t('apartments.residentType'),
            this.i18n.t('apartments.paymentStatus'),
            this.i18n.t('apartments.dueAmount'),
          ],
          apartments.map((apt) => [
            apt.number,
            apt.floor,
            apt.ownerName ?? '-',
            apt.ownerPhone ?? '-',
            apt.tenantName ?? '-',
            apt.residentType === 'owner' ? this.i18n.t('role.Owner') : this.i18n.t('role.Tenant'),
            apt.paymentStatus,
            apt.dueAmount,
          ]),
        );
        this.error.set(null);
        this.exporting.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
        this.exporting.set(false);
      },
    });
  }
}
