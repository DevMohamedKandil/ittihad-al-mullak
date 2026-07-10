import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  LucideIconData,
  Plus,
  Clock,
  Wrench,
  CheckCircle2,
  Camera,
  MessageSquare,
  ChevronLeft,
  AlertTriangle,
  Droplets,
  Zap,
  Wind,
  Building,
} from 'lucide-angular';
import { OwnerHeader } from '../header';
import { MaintenanceApi, OwnerApi } from '../../../core/api.services';
import {
  MaintenancePriority,
  MaintenanceRequest,
  MaintenanceStatus,
} from '../../../core/models';
import { formatRelative } from '../../../core/format';

type RequestTab = 'active' | 'completed';

@Component({
  selector: 'app-owner-maintenance',
  imports: [FormsModule, OwnerHeader, LucideAngularModule],
  templateUrl: './maintenance.html',
})
export class OwnerMaintenance {
  private readonly ownerApi = inject(OwnerApi);
  private readonly maintenanceApi = inject(MaintenanceApi);

  protected readonly icons = {
    plus: Plus,
    checkCircle2: CheckCircle2,
    camera: Camera,
    messageSquare: MessageSquare,
    chevronLeft: ChevronLeft,
  };

  protected readonly formatRelative = formatRelative;

  protected readonly statusConfig: Record<
    MaintenanceStatus,
    { label: string; icon: LucideIconData; class: string; badgeClass: string }
  > = {
    Pending: {
      label: 'قيد الانتظار',
      icon: Clock,
      class: 'bg-warning/10 text-warning',
      badgeClass: 'bg-warning text-warning-foreground',
    },
    InProgress: {
      label: 'جاري التنفيذ',
      icon: Wrench,
      class: 'bg-primary/10 text-primary',
      badgeClass: 'bg-primary text-primary-foreground',
    },
    Completed: {
      label: 'مكتمل',
      icon: CheckCircle2,
      class: 'bg-success/10 text-success',
      badgeClass: 'bg-success text-success-foreground',
    },
    Rejected: {
      label: 'مرفوض',
      icon: AlertTriangle,
      class: 'bg-destructive/10 text-destructive',
      badgeClass: 'bg-destructive text-destructive-foreground',
    },
  };

  protected readonly priorityConfig: Record<MaintenancePriority, { label: string; class: string }> = {
    Low: { label: 'منخفضة', class: 'bg-muted text-muted-foreground' },
    Medium: { label: 'متوسطة', class: 'bg-warning/10 text-warning' },
    High: { label: 'عاجلة', class: 'bg-destructive/10 text-destructive' },
  };

  protected readonly categories = [
    { value: 'سباكة', label: 'سباكة', icon: Droplets },
    { value: 'كهرباء', label: 'كهرباء', icon: Zap },
    { value: 'تكييف', label: 'تكييف', icon: Wind },
    { value: 'عام', label: 'عام', icon: Building },
  ];

  protected readonly requests = signal<MaintenanceRequest[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly activeRequests = computed(() =>
    this.requests().filter((r) => r.status === 'Pending' || r.status === 'InProgress'),
  );
  protected readonly completedRequests = computed(() =>
    this.requests().filter((r) => r.status === 'Completed' || r.status === 'Rejected'),
  );

  protected readonly pendingCount = computed(
    () => this.requests().filter((r) => r.status === 'Pending').length,
  );
  protected readonly inProgressCount = computed(
    () => this.requests().filter((r) => r.status === 'InProgress').length,
  );
  protected readonly completedCount = computed(
    () => this.requests().filter((r) => r.status === 'Completed').length,
  );

  protected readonly isNewRequestOpen = signal(false);
  protected readonly openRequestId = signal<number | null>(null);
  protected readonly activeTab = signal<RequestTab>('active');

  // New request form state
  protected readonly category = signal('');
  protected readonly priority = signal<MaintenancePriority | ''>('');
  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected readonly shownRequests = computed(() =>
    this.activeTab() === 'active' ? this.activeRequests() : this.completedRequests(),
  );

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.ownerApi.maintenance().subscribe({
      next: (requests) => {
        this.requests.set(requests);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? 'تعذر تحميل البيانات');
        this.loading.set(false);
      },
    });
  }

  protected openNewRequest() {
    this.title.set('');
    this.description.set('');
    this.category.set('');
    this.priority.set('');
    this.submitError.set(null);
    this.isNewRequestOpen.set(true);
  }

  protected closeNewRequest() {
    this.isNewRequestOpen.set(false);
  }

  protected submitNewRequest() {
    const priority = this.priority();
    if (!this.title().trim() || !this.description().trim() || !priority || this.submitting()) return;

    this.submitting.set(true);
    this.submitError.set(null);
    this.maintenanceApi
      .create({
        title: this.title().trim(),
        description: this.description().trim(),
        category: this.category() || undefined,
        priority,
        apartmentId: null,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.closeNewRequest();
          this.load();
        },
        error: (err) => {
          this.submitting.set(false);
          this.submitError.set(err.error?.title ?? 'تعذر إرسال الطلب');
        },
      });
  }

  protected openRequest(id: number) {
    this.openRequestId.set(id);
  }

  protected closeRequest() {
    this.openRequestId.set(null);
  }

  protected updatesFor(request: MaintenanceRequest): { date: string; message: string; by: string }[] {
    const updates: { date: string; message: string; by: string }[] = [];
    if (request.status === 'Rejected' && request.rejectionReason) {
      updates.push({
        date: formatRelative(request.resolvedAt ?? request.createdAt),
        message: `تم رفض الطلب: ${request.rejectionReason}`,
        by: 'الإدارة',
      });
    }
    if (request.status === 'Completed') {
      updates.push({
        date: formatRelative(request.resolvedAt),
        message: 'تم الانتهاء من الصيانة بنجاح',
        by: request.assignedTo ?? 'الإدارة',
      });
    }
    if (request.status === 'InProgress' && request.assignedTo) {
      updates.push({
        date: formatRelative(request.createdAt),
        message: `تم إسناد الطلب إلى ${request.assignedTo}`,
        by: 'الإدارة',
      });
    }
    return updates;
  }
}
