import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Download } from 'lucide-angular';
import { StatsCards } from './stats-cards';
import { CollectionChart } from './collection-chart';
import { ApartmentsTable } from './apartments-table';
import { MaintenanceList } from './maintenance-list';
import { AnnouncementsCard } from './announcements-card';
import { ApartmentsApi } from '../../../core/api.services';
import { downloadCsv } from '../../../core/format';
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
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">{{ 'nav.dashboard' | translate }}</h1>
          <p class="text-muted-foreground">{{ 'dashboard.welcome' | translate }}</p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            (click)="exportReport()"
            [disabled]="exporting()"
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-8 px-3 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <lucide-angular [img]="downloadIcon" [size]="16" />
            {{ 'dashboard.exportReport' | translate }}
          </button>
          <button
            type="button"
            routerLink="/admin/invoices"
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <lucide-angular [img]="plusIcon" [size]="16" />
            {{ 'dashboard.addInvoice' | translate }}
          </button>
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
      <div class="grid gap-6 lg:grid-cols-5">
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
  protected readonly i18n = inject(TranslationService);

  protected readonly plusIcon = Plus;
  protected readonly downloadIcon = Download;

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
