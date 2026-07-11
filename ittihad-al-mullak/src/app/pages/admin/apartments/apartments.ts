import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  LucideIconData,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Home,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
} from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApartmentsApi } from '../../../core/api.services';
import { Apartment, PaymentStatusString } from '../../../core/models';
import { formatCurrency } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-apartments-page',
  imports: [FormsModule, LucideAngularModule, TranslatePipe],
  templateUrl: './apartments.html',
})
export class ApartmentsPage implements OnInit {
  private readonly apartmentsApi = inject(ApartmentsApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    plus: Plus,
    search: Search,
    filter: Filter,
    moreVertical: MoreVertical,
    user: User,
    phone: Phone,
    mail: Mail,
    edit: Edit,
    trash2: Trash2,
    eye: Eye,
  };

  protected readonly statusBadges: Record<PaymentStatusString, { label: string; class: string; icon: LucideIconData }> = {
    paid: { label: this.i18n.t('payment.paid'), class: 'bg-success/10 text-success hover:bg-success/20 border-0', icon: CheckCircle },
    overdue: { label: this.i18n.t('payment.overdue'), class: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-0', icon: XCircle },
    unpaid: { label: this.i18n.t('payment.unpaid'), class: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-0', icon: XCircle },
    partial: { label: this.i18n.t('payment.partial'), class: 'bg-warning/10 text-warning-foreground hover:bg-warning/20 border-0', icon: Clock },
  };

  protected readonly apartments = signal<Apartment[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal('all');
  protected readonly selectedApartment = signal<Apartment | null>(null);
  protected readonly addDialogOpen = signal(false);
  protected readonly activeTab = signal<'table' | 'cards'>('table');
  protected readonly openMenuId = signal<number | null>(null);

  // نموذج إضافة شقة
  protected readonly newNumber = signal('');
  protected readonly newFloor = signal<number | null>(null);
  protected readonly saving = signal(false);
  protected readonly addError = signal<string | null>(null);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly stats = computed(() => {
    const items = this.apartments();
    return [
      { label: this.i18n.t('apartmentsAdmin.totalApartments'), value: `${items.length}`, icon: Building2, color: 'text-primary', bg: 'bg-primary/10' },
      { label: this.i18n.t('usersAdmin.owners'), value: `${items.filter((a) => a.residentType === 'owner').length}`, icon: User, color: 'text-secondary', bg: 'bg-secondary/10' },
      { label: this.i18n.t('usersAdmin.tenants'), value: `${items.filter((a) => a.residentType === 'tenant').length}`, icon: Home, color: 'text-warning', bg: 'bg-warning/10' },
      { label: this.i18n.t('apartmentsAdmin.overdueApartments'), value: `${items.filter((a) => a.paymentStatus === 'overdue' || a.paymentStatus === 'unpaid').length}`, icon: Clock, color: 'text-destructive', bg: 'bg-destructive/10' },
    ];
  });

  protected readonly filteredApartments = computed(() => {
    const status = this.statusFilter();
    return this.apartments().filter((apt) => status === 'all' || apt.paymentStatus === status);
  });

  ngOnInit(): void {
    this.load();
  }

  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.load(), 300);
  }

  protected residentName(apt: Apartment): string {
    return (apt.residentType === 'tenant' ? apt.tenantName : apt.ownerName) ?? apt.ownerName ?? '-';
  }

  protected formatAmount(value: number): string {
    return formatCurrency(value);
  }

  protected toggleMenu(id: number) {
    this.openMenuId.update((open) => (open === id ? null : id));
  }

  protected closeMenu() {
    this.openMenuId.set(null);
  }

  protected openDetails(apartment: Apartment) {
    this.closeMenu();
    this.selectedApartment.set(apartment);
  }

  protected openAddDialog() {
    this.newNumber.set('');
    this.newFloor.set(null);
    this.addError.set(null);
    this.addDialogOpen.set(true);
  }

  protected saveApartment() {
    const number = this.newNumber().trim();
    const floor = this.newFloor();
    if (!number || floor === null) {
      this.addError.set(this.i18n.t('apartmentsAdmin.fillNumberAndFloor'));
      return;
    }
    this.saving.set(true);
    this.apartmentsApi.create({ number, floor: Number(floor) }).subscribe({
      next: () => {
        this.saving.set(false);
        this.addDialogOpen.set(false);
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.addError.set(err.error?.title ?? this.i18n.t('apartmentsAdmin.saveFailed'));
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.apartmentsApi.list(this.searchQuery()).subscribe({
      next: (items) => {
        this.apartments.set(items);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
        this.loading.set(false);
      },
    });
  }
}
