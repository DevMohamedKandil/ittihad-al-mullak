import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  LucideIconData,
  Search,
  Filter,
  MoreVertical,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Home,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  Phone,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
} from 'lucide-angular';
import { MaintenanceApi } from '../../../core/api.services';
import { MaintenanceRequest, MaintenanceStatus, MaintenancePriority } from '../../../core/models';
import { formatRelative, formatDate } from '../../../core/format';

@Component({
  selector: 'app-maintenance-page',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './maintenance.html',
})
export class MaintenancePage {
  private readonly api = inject(MaintenanceApi);

  protected readonly icons = {
    search: Search,
    filter: Filter,
    moreVertical: MoreVertical,
    user: User,
    home: Home,
    calendar: Calendar,
    messageSquare: MessageSquare,
    image: ImageIcon,
    phone: Phone,
    wrench: Wrench,
  };

  protected readonly requests = signal<MaintenanceRequest[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly categories = ['سباكة', 'كهرباء', 'مصعد', 'نظافة', 'أمن وسلامة', 'دهانات', 'أخرى'];

  protected readonly statusLabels: Record<MaintenanceStatus, string> = {
    Pending: 'جديد',
    InProgress: 'قيد التنفيذ',
    Completed: 'مكتمل',
    Rejected: 'مرفوض',
  };

  protected readonly priorityLabels: Record<MaintenancePriority, string> = {
    Low: 'منخفضة',
    Medium: 'متوسطة',
    High: 'عالية',
  };

  protected readonly statusBadges: Record<MaintenanceStatus, { class: string; icon: LucideIconData }> = {
    Pending: { class: 'bg-primary/10 text-primary hover:bg-primary/20 border-0', icon: Clock },
    InProgress: { class: 'bg-warning/10 text-warning-foreground hover:bg-warning/20 border-0', icon: Wrench },
    Completed: { class: 'bg-success/10 text-success hover:bg-success/20 border-0', icon: CheckCircle },
    Rejected: { class: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-0', icon: XCircle },
  };

  protected readonly priorityBadges: Record<MaintenancePriority, { class: string; icon: LucideIconData }> = {
    High: {
      class: 'border-transparent bg-warning text-warning-foreground hover:bg-warning/90 gap-1',
      icon: ArrowUpCircle,
    },
    Medium: {
      class: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-1',
      icon: MinusCircle,
    },
    Low: { class: 'text-foreground gap-1', icon: ArrowDownCircle },
  };

  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal('all');
  protected readonly categoryFilter = signal('all');
  protected readonly selectedRequest = signal<MaintenanceRequest | null>(null);
  protected readonly dialogOpen = signal(false);
  protected readonly activeTab = signal<'new' | 'in-progress' | 'completed' | 'all'>('new');
  protected readonly openMenuId = signal<number | null>(null);
  protected readonly newStatus = signal<MaintenanceStatus>('Pending');
  protected readonly assignedTo = signal('');
  protected readonly rejectionReason = signal('');
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected readonly stats = computed(() => {
    const list = this.requests();
    return [
      {
        label: 'جديد',
        value: list.filter((r) => r.status === 'Pending').length,
        icon: Clock,
        color: 'text-primary',
        bg: 'bg-primary/10',
      },
      {
        label: 'قيد التنفيذ',
        value: list.filter((r) => r.status === 'InProgress').length,
        icon: Wrench,
        color: 'text-warning-foreground',
        bg: 'bg-warning/10',
      },
      {
        label: 'مكتمل',
        value: list.filter((r) => r.status === 'Completed').length,
        icon: CheckCircle,
        color: 'text-success',
        bg: 'bg-success/10',
      },
      {
        label: 'أولوية عالية',
        value: list.filter((r) => r.priority === 'High' && (r.status === 'Pending' || r.status === 'InProgress'))
          .length,
        icon: AlertTriangle,
        color: 'text-destructive',
        bg: 'bg-destructive/10',
      },
    ];
  });

  protected readonly filteredRequests = computed(() => {
    const query = this.searchQuery();
    const status = this.statusFilter();
    const category = this.categoryFilter();
    return this.requests().filter((req) => {
      const matchesSearch =
        req.title.includes(query) || String(req.id).includes(query) || req.requesterName.includes(query);
      const matchesStatus = status === 'all' || req.status === status;
      const matchesCategory = category === 'all' || req.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  });

  protected readonly visibleRequests = computed(() => {
    const requests = this.filteredRequests();
    switch (this.activeTab()) {
      case 'new':
        return requests.filter((r) => r.status === 'Pending');
      case 'in-progress':
        return requests.filter((r) => r.status === 'InProgress');
      case 'completed':
        return requests.filter((r) => r.status === 'Completed' || r.status === 'Rejected');
      default:
        return requests;
    }
  });

  protected readonly newCount = computed(() => this.requests().filter((r) => r.status === 'Pending').length);
  protected readonly inProgressCount = computed(
    () => this.requests().filter((r) => r.status === 'InProgress').length,
  );
  protected readonly completedCount = computed(
    () => this.requests().filter((r) => r.status === 'Completed' || r.status === 'Rejected').length,
  );

  constructor() {
    this.load();
  }

  protected load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.list().subscribe({
      next: (items) => {
        this.requests.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? 'تعذر تحميل البيانات');
        this.loading.set(false);
      },
    });
  }

  protected formatRelative(value: string | null): string {
    return formatRelative(value);
  }

  protected formatDate(value: string | null): string {
    return formatDate(value);
  }

  protected toggleMenu(id: number) {
    this.openMenuId.update((open) => (open === id ? null : id));
  }

  protected closeMenu() {
    this.openMenuId.set(null);
  }

  protected selectRequest(request: MaintenanceRequest) {
    this.closeMenu();
    this.selectedRequest.set(request);
    this.newStatus.set(request.status);
    this.assignedTo.set(request.assignedTo ?? '');
    this.rejectionReason.set(request.rejectionReason ?? '');
    this.saveError.set(null);
    this.dialogOpen.set(true);
  }

  protected closeDialog() {
    this.dialogOpen.set(false);
  }

  protected saveStatus() {
    const request = this.selectedRequest();
    if (!request || this.saving()) return;
    this.saving.set(true);
    this.saveError.set(null);
    this.api
      .updateStatus(request.id, {
        status: this.newStatus(),
        assignedTo: this.assignedTo() || undefined,
        rejectionReason: this.rejectionReason() || undefined,
      })
      .subscribe({
        next: (updated) => {
          this.requests.update((list) => list.map((r) => (r.id === updated.id ? updated : r)));
          this.selectedRequest.set(updated);
          this.saving.set(false);
          this.dialogOpen.set(false);
        },
        error: (err) => {
          this.saveError.set(err.error?.title ?? 'تعذر حفظ التحديثات');
          this.saving.set(false);
        },
      });
  }
}
