import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
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
import { TranslatePipe } from '@ngx-translate/core';
import { OwnerHeader } from '../header';
import { MaintenanceApi, OwnerApi } from '../../../core/api.services';
import {
  MaintenancePriority,
  MaintenanceRequest,
  MaintenanceStatus,
} from '../../../core/models';
import { APP_CONFIG } from '../../../core/app-config';
import { formatRelative } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';
import { EmptyState } from '../../../shared/empty-state';

type RequestTab = 'active' | 'completed';

@Component({
  selector: 'app-owner-maintenance',
  imports: [FormsModule, OwnerHeader, LucideAngularModule, TranslatePipe, EmptyState],
  templateUrl: './maintenance.html',
})
export class OwnerMaintenance {
  private readonly ownerApi = inject(OwnerApi);
  private readonly maintenanceApi = inject(MaintenanceApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    plus: Plus,
    checkCircle2: CheckCircle2,
    camera: Camera,
    messageSquare: MessageSquare,
    chevronLeft: ChevronLeft,
    wrench: Wrench,
  };

  protected readonly formatRelative = formatRelative;
  protected readonly filesBaseUrl = APP_CONFIG.filesUrl;

  protected readonly statusConfig: Record<
    MaintenanceStatus,
    { label: string; icon: LucideIconData; class: string; badgeClass: string }
  > = {
    Pending: {
      label: this.i18n.t('maintenance.Pending'),
      icon: Clock,
      class: 'bg-warning/10 text-warning',
      badgeClass: 'bg-warning text-warning-foreground',
    },
    InProgress: {
      label: this.i18n.t('maintenance.InProgress'),
      icon: Wrench,
      class: 'bg-primary/10 text-primary',
      badgeClass: 'bg-primary text-primary-foreground',
    },
    Completed: {
      label: this.i18n.t('maintenance.Completed'),
      icon: CheckCircle2,
      class: 'bg-success/10 text-success',
      badgeClass: 'bg-success text-success-foreground',
    },
    Rejected: {
      label: this.i18n.t('maintenance.Rejected'),
      icon: AlertTriangle,
      class: 'bg-destructive/10 text-destructive',
      badgeClass: 'bg-destructive text-destructive-foreground',
    },
  };

  protected readonly priorityConfig: Record<MaintenancePriority, { label: string; class: string }> = {
    Low: { label: this.i18n.t('priority.Low'), class: 'bg-muted text-muted-foreground' },
    Medium: { label: this.i18n.t('priority.Medium'), class: 'bg-warning/10 text-warning' },
    High: { label: this.i18n.t('priority.High'), class: 'bg-destructive/10 text-destructive' },
  };

  protected readonly categories = [
    { value: 'سباكة', label: this.i18n.t('owner.maintenance.categoryPlumbing'), icon: Droplets },
    { value: 'كهرباء', label: this.i18n.t('owner.maintenance.categoryElectricity'), icon: Zap },
    { value: 'تكييف', label: this.i18n.t('owner.maintenance.categoryAc'), icon: Wind },
    { value: 'عام', label: this.i18n.t('owner.maintenance.categoryGeneral'), icon: Building },
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
  protected readonly selectedPhotos = signal<File[]>([]);
  protected readonly photoPreviews = signal<string[]>([]);

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
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
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
    this.selectedPhotos.set([]);
    this.photoPreviews.set([]);
    this.isNewRequestOpen.set(true);
  }

  protected onPhotosSelected(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []).slice(0, 5);
    this.selectedPhotos.set(files);
    this.photoPreviews().forEach((url) => URL.revokeObjectURL(url));
    this.photoPreviews.set(files.map((file) => URL.createObjectURL(file)));
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
        next: (created) => {
          const photos = this.selectedPhotos();
          if (photos.length === 0) {
            this.submitting.set(false);
            this.closeNewRequest();
            this.load();
            return;
          }
          // رفع الصور واحدة ورا التانية بعد إنشاء الطلب
          forkJoin(photos.map((file) => this.maintenanceApi.uploadPhoto(created.id, file))).subscribe({
            next: () => {
              this.submitting.set(false);
              this.closeNewRequest();
              this.load();
            },
            error: (err) => {
              // الطلب اتسجل بس صورة فشلت — نبلّغ ونكمل
              this.submitting.set(false);
              this.closeNewRequest();
              this.load();
              console.warn('photo upload failed:', err.error?.title);
            },
          });
        },
        error: (err) => {
          this.submitting.set(false);
          this.submitError.set(err.error?.title ?? this.i18n.t('owner.maintenance.submitFailed'));
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
        message: this.i18n.t('owner.maintenance.rejectedMessage', { reason: request.rejectionReason }),
        by: this.i18n.t('owner.maintenance.management'),
      });
    }
    if (request.status === 'Completed') {
      updates.push({
        date: formatRelative(request.resolvedAt),
        message: this.i18n.t('owner.maintenance.completedMessage'),
        by: request.assignedTo ?? this.i18n.t('owner.maintenance.management'),
      });
    }
    if (request.status === 'InProgress' && request.assignedTo) {
      updates.push({
        date: formatRelative(request.createdAt),
        message: this.i18n.t('owner.maintenance.assignedMessage', { assignedTo: request.assignedTo }),
        by: this.i18n.t('owner.maintenance.management'),
      });
    }
    return updates;
  }
}
