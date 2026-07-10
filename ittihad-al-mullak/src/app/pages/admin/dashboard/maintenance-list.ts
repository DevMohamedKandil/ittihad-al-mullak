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
import { MaintenanceApi } from '../../../core/api.services';
import { MaintenanceRequest, MaintenancePriority, MaintenanceStatus } from '../../../core/models';
import { formatRelative } from '../../../core/format';

@Component({
  selector: 'app-maintenance-list',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './maintenance-list.html',
})
export class MaintenanceList implements OnInit {
  private readonly maintenanceApi = inject(MaintenanceApi);

  protected readonly chevronLeftIcon = ChevronLeft;

  protected readonly requests = signal<MaintenanceRequest[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly statusConfig: Record<MaintenanceStatus, { label: string; icon: LucideIconData; class: string }> = {
    Pending: { label: 'قيد الانتظار', icon: Clock, class: 'text-warning bg-warning/10' },
    InProgress: { label: 'جاري التنفيذ', icon: Wrench, class: 'text-primary bg-primary/10' },
    Completed: { label: 'مكتمل', icon: CheckCircle2, class: 'text-success bg-success/10' },
    Rejected: { label: 'مرفوض', icon: XCircle, class: 'text-destructive bg-destructive/10' },
  };

  protected readonly priorityConfig: Record<MaintenancePriority, { label: string; class: string }> = {
    Low: { label: 'منخفض', class: 'bg-muted text-muted-foreground' },
    Medium: { label: 'متوسط', class: 'bg-warning/10 text-warning' },
    High: { label: 'عاجل', class: 'bg-destructive/10 text-destructive' },
  };

  ngOnInit(): void {
    this.maintenanceApi.list().subscribe({
      next: (items) => {
        this.requests.set(items.slice(0, 5));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? 'تعذر تحميل البيانات');
        this.loading.set(false);
      },
    });
  }

  protected relative(iso: string): string {
    return formatRelative(iso);
  }
}
