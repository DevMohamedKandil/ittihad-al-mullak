import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { Invoice, PaymentMethod, PaymentStatusString } from '../../../core/models';
import { formatDate } from '../../../core/format';

type BillTab = 'pending' | 'paid';

@Component({
  selector: 'app-owner-bills',
  imports: [FormsModule, OwnerHeader, LucideAngularModule],
  templateUrl: './bills.html',
})
export class OwnerBills {
  private readonly ownerApi = inject(OwnerApi);
  private readonly invoicesApi = inject(InvoicesApi);
  private readonly auth = inject(AuthService);

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
      label: 'مدفوع',
      icon: CheckCircle2,
      class: 'bg-success/10 text-success',
      badgeClass: 'bg-success text-success-foreground',
    },
    unpaid: {
      label: 'مستحق',
      icon: Clock,
      class: 'bg-warning/10 text-warning',
      badgeClass: 'bg-warning text-warning-foreground',
    },
    overdue: {
      label: 'متأخر',
      icon: AlertCircle,
      class: 'bg-destructive/10 text-destructive',
      badgeClass: 'bg-destructive text-destructive-foreground',
    },
    partial: {
      label: 'جزئي',
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
    { id: 'Fawry', name: 'فوري', icon: Smartphone, description: 'ادفع عبر أي منفذ فوري' },
    { id: 'Card', name: 'بطاقة ائتمان', icon: CreditCard, description: 'فيزا أو ماستركارد' },
    { id: 'BankTransfer', name: 'تحويل بنكي', icon: Building2, description: 'تحويل مباشر للحساب البنكي' },
    { id: 'Cash', name: 'نقداً', icon: Banknote, description: 'الدفع للجنة الإدارة' },
  ];

  protected readonly bills = signal<Invoice[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly canPay = computed(() => this.auth.currentUser()?.role !== 'Tenant');

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
        this.error.set(err.error?.title ?? 'تعذر تحميل البيانات');
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
        this.successMessage.set('تم الدفع بنجاح');
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: (err) => {
        this.paying.set(false);
        this.payError.set(err.error?.title ?? 'تعذر إتمام الدفع');
      },
    });
  }
}
