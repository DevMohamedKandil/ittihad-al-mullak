import { Component, computed, inject, input } from '@angular/core';
import { LucideAngularModule, Receipt, Wrench, Bell, CreditCard } from 'lucide-angular';
import { OwnerSummary } from '../../../core/models';
import { formatCurrency, formatDate } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-quick-stats',
  imports: [LucideAngularModule],
  templateUrl: './quick-stats.html',
})
export class QuickStats {
  readonly summary = input.required<OwnerSummary>();

  protected readonly i18n = inject(TranslationService);

  protected readonly stats = computed(() => {
    const s = this.summary();
    return [
      {
        icon: Receipt,
        iconClass: 'text-destructive',
        label: this.i18n.t('owner.home.dueAmount'),
        value: formatCurrency(s.dueAmount),
        iconBg: 'bg-destructive/10',
      },
      {
        icon: CreditCard,
        iconClass: 'text-success',
        label: this.i18n.t('owner.home.lastPayment'),
        value: formatDate(s.lastPaymentDate),
        iconBg: 'bg-success/10',
      },
      {
        icon: Wrench,
        iconClass: 'text-warning',
        label: this.i18n.t('owner.home.maintenanceRequests'),
        value: this.i18n.t('owner.home.activeCount', {
          count: s.activeMaintenanceCount.toLocaleString('ar-EG'),
        }),
        iconBg: 'bg-warning/10',
      },
      {
        icon: Bell,
        iconClass: 'text-primary',
        label: this.i18n.t('owner.home.newAnnouncements'),
        value: s.newAnnouncementsCount.toLocaleString('ar-EG'),
        iconBg: 'bg-primary/10',
      },
    ];
  });
}
