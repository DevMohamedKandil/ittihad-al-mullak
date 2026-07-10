import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, Receipt, Wrench, Bell, CreditCard } from 'lucide-angular';
import { OwnerSummary } from '../../../core/models';
import { formatCurrency, formatDate } from '../../../core/format';

@Component({
  selector: 'app-quick-stats',
  imports: [LucideAngularModule],
  templateUrl: './quick-stats.html',
})
export class QuickStats {
  readonly summary = input.required<OwnerSummary>();

  protected readonly stats = computed(() => {
    const s = this.summary();
    return [
      {
        icon: Receipt,
        iconClass: 'text-destructive',
        label: 'المستحق',
        value: formatCurrency(s.dueAmount),
        iconBg: 'bg-destructive/10',
      },
      {
        icon: CreditCard,
        iconClass: 'text-success',
        label: 'آخر دفعة',
        value: formatDate(s.lastPaymentDate),
        iconBg: 'bg-success/10',
      },
      {
        icon: Wrench,
        iconClass: 'text-warning',
        label: 'طلبات صيانة',
        value: `${s.activeMaintenanceCount.toLocaleString('ar-EG')} نشط`,
        iconBg: 'bg-warning/10',
      },
      {
        icon: Bell,
        iconClass: 'text-primary',
        label: 'إعلانات جديدة',
        value: s.newAnnouncementsCount.toLocaleString('ar-EG'),
        iconBg: 'bg-primary/10',
      },
    ];
  });
}
