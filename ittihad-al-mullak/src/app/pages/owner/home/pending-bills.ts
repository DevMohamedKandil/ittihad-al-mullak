import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, ChevronLeft, CreditCard, Calendar, CheckCircle2 } from 'lucide-angular';
import { Invoice, PaymentStatusString } from '../../../core/models';
import { formatDate } from '../../../core/format';
import { AuthService } from '../../../core/auth.service';
import { PermissionsService } from '../../../core/permissions.service';
import { TranslationService } from '../../../core/i18n/translation.service';
import { EmptyState } from '../../../shared/empty-state';

@Component({
  selector: 'app-pending-bills',
  imports: [RouterLink, LucideAngularModule, TranslatePipe, EmptyState],
  templateUrl: './pending-bills.html',
})
export class PendingBills {
  readonly bills = input.required<Invoice[]>();

  private readonly auth = inject(AuthService);
  private readonly permissions = inject(PermissionsService);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    chevronLeft: ChevronLeft,
    creditCard: CreditCard,
    calendar: Calendar,
    checkCircle2: CheckCircle2,
  };

  protected readonly formatDate = formatDate;

  protected readonly canPay = computed(() => this.permissions.all().has('Invoices.Pay'));

  protected readonly totalDue = computed(() =>
    this.bills().reduce((acc, bill) => acc + (bill.amount - bill.paidAmount), 0),
  );

  protected readonly statusConfig: Record<PaymentStatusString, { label: string; class: string }> = {
    unpaid: { label: this.i18n.t('owner.bills.statusDue'), class: 'bg-warning/10 text-warning' },
    overdue: { label: this.i18n.t('payment.overdue'), class: 'bg-destructive/10 text-destructive' },
    partial: { label: this.i18n.t('payment.partial'), class: 'bg-primary/10 text-primary' },
    paid: { label: this.i18n.t('payment.paid'), class: 'bg-success/10 text-success' },
  };
}
