import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  MoreVertical,
  Eye,
  Receipt,
  MessageSquare,
  Phone,
  X,
  Building2,
} from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ApartmentsApi, ConversationsApi, InvoicesApi } from '../../../core/api.services';
import { Apartment } from '../../../core/models';
import { formatCurrency } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';

const ARABIC_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

@Component({
  selector: 'app-apartments-table',
  imports: [FormsModule, LucideAngularModule, TranslatePipe],
  templateUrl: './apartments-table.html',
})
export class ApartmentsTable implements OnInit {
  private readonly apartmentsApi = inject(ApartmentsApi);
  private readonly invoicesApi = inject(InvoicesApi);
  private readonly conversationsApi = inject(ConversationsApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    search: Search,
    moreVertical: MoreVertical,
    eye: Eye,
    receipt: Receipt,
    messageSquare: MessageSquare,
    phone: Phone,
    x: X,
    building2: Building2,
  };

  protected readonly search = signal('');
  protected readonly openMenuId = signal<number | null>(null);
  protected readonly apartments = signal<Apartment[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);

  // Dialogs
  protected readonly detailsFor = signal<Apartment | null>(null);
  protected readonly invoiceFor = signal<Apartment | null>(null);
  protected readonly messageFor = signal<Apartment | null>(null);

  // Invoice form
  protected readonly invoiceTitle = signal(this.i18n.t('invoices.monthlySubscription'));
  protected readonly invoiceAmount = signal(500);
  protected readonly invoicePeriod = signal('');
  protected readonly invoiceDueDate = signal('');
  protected readonly submitting = signal(false);
  protected readonly dialogError = signal<string | null>(null);

  // Message form
  protected readonly messageText = signal('');

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly statusConfig = {
    paid: { label: this.i18n.t('payment.paid'), class: 'border-transparent bg-success text-success-foreground' },
    partial: { label: this.i18n.t('payment.partial'), class: 'border-transparent bg-warning text-warning-foreground' },
    unpaid: { label: this.i18n.t('payment.unpaid'), class: 'border-transparent bg-destructive text-destructive-foreground' },
    overdue: { label: this.i18n.t('payment.overdue'), class: 'border-transparent bg-destructive text-destructive-foreground' },
  };

  ngOnInit(): void {
    this.load();
  }

  protected onSearchChange(value: string): void {
    this.search.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.load(), 300);
  }

  protected formatDue(amount: number): string {
    return amount > 0 ? formatCurrency(amount) : '-';
  }

  protected formatAmount(amount: number): string {
    return formatCurrency(amount);
  }

  protected toggleMenu(id: number) {
    this.openMenuId.update((open) => (open === id ? null : id));
  }

  protected closeMenu() {
    this.openMenuId.set(null);
  }

  /* ==== عرض التفاصيل ==== */
  protected openDetails(apartment: Apartment) {
    this.closeMenu();
    this.detailsFor.set(apartment);
  }

  /* ==== إرسال فاتورة ==== */
  protected openInvoice(apartment: Apartment) {
    this.closeMenu();
    const now = new Date();
    this.invoiceTitle.set(this.i18n.t('invoices.monthlySubscription'));
    this.invoiceAmount.set(500);
    this.invoicePeriod.set(`${ARABIC_MONTHS[now.getMonth()]} ${now.getFullYear()}`);
    this.invoiceDueDate.set(new Date(now.getFullYear(), now.getMonth(), 15).toISOString().slice(0, 10));
    this.dialogError.set(null);
    this.invoiceFor.set(apartment);
  }

  protected submitInvoice() {
    const apartment = this.invoiceFor();
    if (!apartment || this.submitting() || !this.invoiceTitle().trim() || this.invoiceAmount() <= 0) return;
    this.submitting.set(true);
    this.dialogError.set(null);
    this.invoicesApi
      .create({
        apartmentId: apartment.id,
        title: this.invoiceTitle().trim(),
        period: this.invoicePeriod(),
        amount: this.invoiceAmount(),
        dueDate: new Date(this.invoiceDueDate()).toISOString(),
        type: 'Monthly',
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.invoiceFor.set(null);
          this.showSuccess(this.i18n.t('dashboard.invoiceIssued', { number: apartment.number }));
          this.load();
        },
        error: (err) => {
          this.submitting.set(false);
          this.dialogError.set(err.error?.title ?? this.i18n.t('invoices.issueFailed'));
        },
      });
  }

  /* ==== إرسال رسالة ==== */
  protected openMessage(apartment: Apartment) {
    this.closeMenu();
    this.messageText.set('');
    this.dialogError.set(null);
    this.messageFor.set(apartment);
  }

  protected sendMessage() {
    const apartment = this.messageFor();
    const residentId = apartment?.tenantId ?? apartment?.ownerId;
    if (!apartment || !residentId || !this.messageText().trim() || this.submitting()) return;

    this.submitting.set(true);
    this.dialogError.set(null);
    // فتح (أو إيجاد) محادثة مباشرة مع الساكن ثم إرسال الرسالة
    this.conversationsApi.start(residentId).subscribe({
      next: (conversation) => {
        this.conversationsApi.send(conversation.id, this.messageText().trim()).subscribe({
          next: () => {
            this.submitting.set(false);
            this.messageFor.set(null);
            this.showSuccess(this.i18n.t('dashboard.messageSent', { number: apartment.number }));
          },
          error: (err) => {
            this.submitting.set(false);
            this.dialogError.set(err.error?.title ?? this.i18n.t('dashboard.messageSendFailed'));
          },
        });
      },
      error: (err) => {
        this.submitting.set(false);
        this.dialogError.set(err.error?.title ?? this.i18n.t('dashboard.conversationOpenFailed'));
      },
    });
  }

  protected residentName(apartment: Apartment): string {
    return apartment.residentType === 'tenant'
      ? (apartment.tenantName ?? apartment.ownerName ?? '-')
      : (apartment.ownerName ?? '-');
  }

  private showSuccess(message: string) {
    this.success.set(message);
    setTimeout(() => this.success.set(null), 4000);
  }

  private load(): void {
    this.loading.set(true);
    this.apartmentsApi.list(this.search()).subscribe({
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
