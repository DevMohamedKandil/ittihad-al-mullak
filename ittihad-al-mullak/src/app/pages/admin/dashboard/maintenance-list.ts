import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  LucideIconData,
  Wrench,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
} from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { MaintenanceApi } from '../../../core/api.services';
import { MaintenanceRequest, MaintenancePriority, MaintenanceStatus } from '../../../core/models';
import { formatRelative } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-maintenance-list',
  imports: [LucideAngularModule, RouterLink, TranslatePipe],
  templateUrl: './maintenance-list.html',
})
export class MaintenanceList implements OnInit {
  private readonly maintenanceApi = inject(MaintenanceApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly chevronLeftIcon = ChevronLeft;
  protected readonly wrenchIcon = Wrench;

  protected readonly requests = signal<MaintenanceRequest[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly statusConfig: Record<MaintenanceStatus, { label: string; icon: LucideIconData; class: string }> = {
    Pending: { label: this.i18n.t('maintenance.Pending'), icon: Clock, class: 'text-warning bg-warning/10' },
    InProgress: { label: this.i18n.t('maintenance.InProgress'), icon: Wrench, class: 'text-primary bg-primary/10' },
    Completed: { label: this.i18n.t('maintenance.Completed'), icon: CheckCircle2, class: 'text-success bg-success/10' },
    Rejected: { label: this.i18n.t('maintenance.Rejected'), icon: XCircle, class: 'text-destructive bg-destructive/10' },
  };

  protected readonly priorityConfig: Record<MaintenancePriority, { label: string; class: string }> = {
    Low: { label: this.i18n.t('priority.Low'), class: 'bg-muted text-muted-foreground' },
    Medium: { label: this.i18n.t('priority.Medium'), class: 'bg-warning/10 text-warning' },
    High: { label: this.i18n.t('priority.High'), class: 'bg-destructive/10 text-destructive' },
  };

  ngOnInit(): void {
    this.maintenanceApi.list().subscribe({
      next: (items) => {
        this.requests.set(items.slice(0, 5));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
        this.loading.set(false);
      },
    });
  }

  protected relative(iso: string): string {
    return formatRelative(iso);
  }
}
