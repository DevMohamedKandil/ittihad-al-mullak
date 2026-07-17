import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  LucideIconData,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Receipt,
  Send,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Building2,
  MessageSquare,
} from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApartmentsApi, InvoicesApi } from '../../../core/api.services';
import { Apartment, Invoice, InvoiceType, InvoicesSummary, PaymentMethod, PaymentStatusString } from '../../../core/models';
import { formatCurrency, formatDate as formatDateUtil } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';
import { EmptyState } from '../../../shared/empty-state';

@Component({
  selector: 'app-invoices-page',
  imports: [FormsModule, LucideAngularModule, TranslatePipe, EmptyState],
  templateUrl: './invoices.html',
})
export class InvoicesPage implements OnInit {
  private readonly invoicesApi = inject(InvoicesApi);
  private readonly apartmentsApi = inject(ApartmentsApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    plus: Plus,
    search: Search,
    filter: Filter,
    moreVertical: MoreVertical,
    receipt: Receipt,
    send: Send,
    download: Download,
    eye: Eye,
    trash2: Trash2,
    checkCircle: CheckCircle,
    clock: Clock,
    calendar: Calendar,
    building2: Building2,
    messageSquare: MessageSquare,
  };

  protected readonly statusBadges: Record<PaymentStatusString, { label: string; class: string; icon: LucideIconData }> = {
    paid: { label: this.i18n.t('payment.paid'), class: 'bg-success/10 text-success hover:bg-success/20 border-0', icon: CheckCircle },
    overdue: { label: this.i18n.t('payment.overdue'), class: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-0', icon: XCircle },
    unpaid: { label: this.i18n.t('payment.unpaid'), class: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-0', icon: XCircle },
    partial: { label: this.i18n.t('payment.partial'), class: 'bg-warning/10 text-warning-foreground hover:bg-warning/20 border-0', icon: Clock },
  };

  protected readonly invoices = signal<Invoice[]>([]);
  protected readonly summary = signal<InvoicesSummary | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal('all');
  protected readonly selectedInvoice = signal<Invoice | null>(null);
  protected readonly createDialogOpen = signal(false);
  protected readonly remindersDialogOpen = signal(false);
  protected readonly openMenuId = signal<number | null>(null);

  // نموذج إنشاء فاتورة
  protected readonly apartments = signal<Apartment[]>([]);
  protected readonly newApartmentId = signal<number | null>(null); // null → جميع الشقق
  protected readonly newTitle = signal('');
  protected readonly newPeriod = signal('');
  protected readonly newAmount = signal<number | null>(null);
  protected readonly newDueDate = signal('');
  protected readonly newType = signal<InvoiceType>('Monthly');
  protected readonly creating = signal(false);
  protected readonly createError = signal<string | null>(null);

  // تسجيل دفعة
  protected readonly payAmount = signal<number | null>(null);
  protected readonly payMethod = signal<PaymentMethod>('Cash');
  protected readonly paying = signal(false);
  protected readonly payError = signal<string | null>(null);

  // إرسال التذكيرات
  protected readonly sendingReminders = signal(false);
  protected readonly remindersResult = signal<string | null>(null);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadInvoices();
    this.loadSummary();
    this.apartmentsApi.list().subscribe({
      next: (items) => this.apartments.set(items),
      error: () => {},
    });
  }

  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadInvoices(), 300);
  }

  protected onStatusChange(value: string): void {
    this.statusFilter.set(value);
    this.loadInvoices();
  }

  protected formatAmount(value: number): string {
    return formatCurrency(value);
  }

  protected formatDate(value: string): string {
    return formatDateUtil(value);
  }

  protected typeLabel(type: InvoiceType): string {
    return type === 'Monthly'
      ? this.i18n.t('invoices.typeMonthly')
      : type === 'Maintenance'
        ? this.i18n.t('invoices.typeMaintenance')
        : this.i18n.t('invoices.typeSpecial');
  }

  protected toggleMenu(id: number) {
    this.openMenuId.update((open) => (open === id ? null : id));
  }

  protected closeMenu() {
    this.openMenuId.set(null);
  }

  protected openDetails(invoice: Invoice) {
    this.closeMenu();
    this.payAmount.set(null);
    this.payMethod.set('Cash');
    this.payError.set(null);
    this.selectedInvoice.set(invoice);
  }

  protected openCreateDialog() {
    this.newApartmentId.set(null);
    this.newTitle.set('');
    this.newPeriod.set('');
    this.newAmount.set(null);
    this.newDueDate.set('');
    this.newType.set('Monthly');
    this.createError.set(null);
    this.createDialogOpen.set(true);
  }

  protected createInvoice() {
    const title = this.newTitle().trim();
    const period = this.newPeriod().trim();
    const amount = this.newAmount();
    const dueDate = this.newDueDate();
    if (!title || !period || !amount || !dueDate) {
      this.createError.set(this.i18n.t('invoices.fillAllFields'));
      return;
    }
    this.creating.set(true);
    this.invoicesApi
      .create({
        apartmentId: this.newApartmentId(),
        title,
        period,
        amount: Number(amount),
        dueDate: new Date(dueDate).toISOString(),
        type: this.newType(),
      })
      .subscribe({
        next: () => {
          this.creating.set(false);
          this.createDialogOpen.set(false);
          this.loadInvoices();
          this.loadSummary();
        },
        error: (err) => {
          this.creating.set(false);
          this.createError.set(err.error?.title ?? this.i18n.t('invoices.createFailed'));
        },
      });
  }

  protected sendReminders() {
    this.sendingReminders.set(true);
    this.invoicesApi.sendReminders().subscribe({
      next: (res) => {
        this.sendingReminders.set(false);
        this.remindersResult.set(this.i18n.t('invoices.remindersSent', { count: res.notifiedOwners }));
        this.remindersDialogOpen.set(false);
      },
      error: (err) => {
        this.sendingReminders.set(false);
        this.remindersResult.set(err.error?.title ?? this.i18n.t('invoices.remindersFailed'));
        this.remindersDialogOpen.set(false);
      },
    });
  }

  protected recordPayment(invoice: Invoice) {
    const amount = this.payAmount();
    if (!amount || amount <= 0) {
      this.payError.set(this.i18n.t('invoices.enterValidAmount'));
      return;
    }
    this.paying.set(true);
    this.invoicesApi.pay(invoice.id, { amount: Number(amount), method: this.payMethod() }).subscribe({
      next: (updated) => {
        this.paying.set(false);
        this.selectedInvoice.set(updated);
        this.payAmount.set(null);
        this.payError.set(null);
        this.loadInvoices();
        this.loadSummary();
      },
      error: (err) => {
        this.paying.set(false);
        this.payError.set(err.error?.title ?? this.i18n.t('invoices.paymentFailed'));
      },
    });
  }

  private loadInvoices(): void {
    this.loading.set(true);
    const status = this.statusFilter();
    this.invoicesApi
      .list({ status: status === 'all' ? undefined : status, search: this.searchQuery() || undefined })
      .subscribe({
        next: (page) => {
          this.invoices.set(page.items);
          this.error.set(null);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.title ?? this.i18n.t('common.error'));
          this.loading.set(false);
        },
      });
  }

  private loadSummary(): void {
    this.invoicesApi.summary().subscribe({
      next: (summary) => this.summary.set(summary),
      error: (err) => this.error.set(err.error?.title ?? this.i18n.t('common.error')),
    });
  }
}
