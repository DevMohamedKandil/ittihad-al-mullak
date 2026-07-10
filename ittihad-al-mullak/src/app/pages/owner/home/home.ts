import { Component, inject, signal } from '@angular/core';
import { OwnerHeader } from '../header';
import { QuickStats } from './quick-stats';
import { PendingBills } from './pending-bills';
import { AnnouncementsList } from './announcements-list';
import { OwnerApi } from '../../../core/api.services';
import { OwnerSummary } from '../../../core/models';

@Component({
  selector: 'app-owner-home',
  imports: [OwnerHeader, QuickStats, PendingBills, AnnouncementsList],
  templateUrl: './home.html',
})
export class OwnerHome {
  private readonly ownerApi = inject(OwnerApi);

  protected readonly summary = signal<OwnerSummary | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.ownerApi.summary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? 'تعذر تحميل البيانات');
        this.loading.set(false);
      },
    });
  }
}
