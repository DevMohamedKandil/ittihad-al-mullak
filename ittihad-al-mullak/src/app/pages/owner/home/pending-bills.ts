import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ChevronLeft, CreditCard, Calendar } from 'lucide-angular';
import { Invoice, PaymentStatusString } from '../../../core/models';
import { formatDate } from '../../../core/format';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-pending-bills',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './pending-bills.html',
})
export class PendingBills {
  readonly bills = input.required<Invoice[]>();

  private readonly auth = inject(AuthService);

  protected readonly icons = {
    chevronLeft: ChevronLeft,
    creditCard: CreditCard,
    calendar: Calendar,
  };

  protected readonly formatDate = formatDate;

  protected readonly canPay = computed(() => this.auth.currentUser()?.role !== 'Tenant');

  protected readonly totalDue = computed(() =>
    this.bills().reduce((acc, bill) => acc + (bill.amount - bill.paidAmount), 0),
  );

  protected readonly statusConfig: Record<PaymentStatusString, { label: string; class: string }> = {
    unpaid: { label: 'مستحق', class: 'bg-warning/10 text-warning' },
    overdue: { label: 'متأخر', class: 'bg-destructive/10 text-destructive' },
    partial: { label: 'جزئي', class: 'bg-primary/10 text-primary' },
    paid: { label: 'مدفوع', class: 'bg-success/10 text-success' },
  };
}
