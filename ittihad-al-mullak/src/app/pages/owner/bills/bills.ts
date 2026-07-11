import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideAngularModule,
  LucideIconData,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Smartphone,
  Building2,
  Banknote,
} from 'lucide-angular';
import { OwnerHeader } from '../header';
import { InvoicesApi, OwnerApi } from '../../../core/api.services';
import { AuthService } from '../../../core/auth.service';
import { PermissionsService } from '../../../core/permissions.service';
import { Invoice, PaymentMethod, PaymentStatusString } from '../../../core/models';
import { formatDate } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';

type BillTab = 'pending' | 'paid';

@Component({
  selector: 'app-owner-bills',
  imports: [FormsModule, OwnerHeader, LucideAngularModule, TranslatePipe],
  templateUrl: './bills.html',
})
export class OwnerBills {
  private readonly ownerApi = inject(OwnerApi);
  private readonly invoicesApi = inject(InvoicesApi);
  private readonly auth = inject(AuthService);
  private readonly permissions = inject(PermissionsService);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    creditCard: CreditCard,
    calendar: Calendar,
    checkCircle2: CheckCircle2,
    download: Download,
  };

  protected readonly formatDate = formatDate;

  protected readonly statusConfig: Record<
    PaymentStatusString,
    { label: string; icon: LucideIconData; class: string; badgeClass: string }
  > = {
    paid: {
      label: this.i18n.t('payment.paid'),
      icon: CheckCircle2,
      class: 'bg-success/10 text-success',
      badgeClass: 'bg-success text-success-foreground',
    },
    unpaid: {
      label: this.i18n.t('owner.bills.statusDue'),
      icon: Clock,
      class: 'bg-warning/10 text-warning',
      badgeClass: 'bg-warning text-warning-foreground',
    },
    overdue: {
      label: this.i18n.t('payment.overdue'),
      icon: AlertCircle,
      class: 'bg-destructive/10 text-destructive',
      badgeClass: 'bg-destructive text-destructive-foreground',
    },
    partial: {
      label: this.i18n.t('payment.partial'),
      icon: Clock,
      class: 'bg-primary/10 text-primary',
      badgeClass: 'bg-primary text-primary-foreground',
    },
  };

  protected readonly paymentMethods: {
    id: PaymentMethod;
    name: string;
    icon: LucideIconData;
    description: string;
  }[] = [
    {
      id: 'Fawry',
      name: this.i18n.t('method.Fawry'),
      icon: Smartphone,
      description: this.i18n.t('owner.bills.methodFawryDesc'),
    },
    {
      id: 'Card',
      name: this.i18n.t('owner.bills.methodCardName'),
      icon: CreditCard,
      description: this.i18n.t('owner.bills.methodCardDesc'),
    },
    {
      id: 'BankTransfer',
      name: this.i18n.t('method.BankTransfer'),
      icon: Building2,
      description: this.i18n.t('owner.bills.methodBankDesc'),
    },
    {
      id: 'Cash',
      name: this.i18n.t('owner.bills.methodCashName'),
      icon: Banknote,
      description: this.i18n.t('owner.bills.methodCashDesc'),
    },
  ];

  protected readonly bills = signal<Invoice[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly canPay = computed(() => this.permissions.all().has('Invoices.Pay'));

  protected readonly pendingBills = computed(() =>
    this.bills().filter((bill) => bill.status !== 'paid'),
  );
  protected readonly paidBills = computed(() =>
    this.bills().filter((bill) => bill.status === 'paid'),
  );
  protected readonly totalDue = computed(() =>
    this.pendingBills().reduce((acc, bill) => acc + (bill.amount - bill.paidAmount), 0),
  );

  protected readonly activeTab = signal<BillTab>('pending');
  protected readonly paymentBillId = signal<number | null>(null);

  // Payment dialog state
  protected readonly selectedMethod = signal<PaymentMethod | null>(null);
  protected readonly payAmount = signal<number>(0);
  protected readonly paying = signal(false);
  protected readonly payError = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly shownBills = computed(() =>
    this.activeTab() === 'pending' ? this.pendingBills() : this.paidBills(),
  );

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.ownerApi.bills().subscribe({
      next: (bills) => {
        this.bills.set(bills);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
        this.loading.set(false);
      },
    });
  }

  protected remaining(bill: Invoice): number {
    return bill.amount - bill.paidAmount;
  }

  protected openPayment(bill: Invoice) {
    this.activeTab.set('pending');
    this.paymentBillId.set(bill.id);
    this.selectedMethod.set(null);
    this.payAmount.set(this.remaining(bill));
    this.payError.set(null);
  }

  protected closePayment() {
    this.paymentBillId.set(null);
    this.selectedMethod.set(null);
    this.payError.set(null);
  }

  protected confirmPayment(bill: Invoice) {
    const method = this.selectedMethod();
    const amount = Number(this.payAmount());
    if (!method || !(amount > 0) || this.paying()) return;

    this.paying.set(true);
    this.payError.set(null);
    this.invoicesApi.pay(bill.id, { amount, method }).subscribe({
      next: (updated) => {
        this.bills.update((bills) => bills.map((b) => (b.id === updated.id ? updated : b)));
        this.paying.set(false);
        this.closePayment();
        this.successMessage.set(this.i18n.t('owner.bills.paymentSuccess'));
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: (err) => {
        this.paying.set(false);
        this.payError.set(err.error?.title ?? this.i18n.t('owner.bills.paymentFailed'));
      },
    });
  }
}
