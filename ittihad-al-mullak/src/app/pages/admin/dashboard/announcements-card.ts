import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Plus,
  ChevronLeft,
  Megaphone,
  Calendar,
} from 'lucide-angular';
import { AnnouncementsApi } from '../../../core/api.services';
import { Announcement, AnnouncementType } from '../../../core/models';
import { formatDate } from '../../../core/format';

@Component({
  selector: 'app-announcements-card',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './announcements-card.html',
})
export class AnnouncementsCard implements OnInit {
  private readonly announcementsApi = inject(AnnouncementsApi);

  protected readonly icons = {
    plus: Plus,
    chevronLeft: ChevronLeft,
    megaphone: Megaphone,
    calendar: Calendar,
  };

  protected readonly announcements = signal<Announcement[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly typeConfig: Record<AnnouncementType, { label: string; class: string }> = {
    General: { label: 'عام', class: 'bg-primary/10 text-primary' },
    Urgent: { label: 'عاجل', class: 'bg-destructive/10 text-destructive' },
    Financial: { label: 'مالي', class: 'bg-success/10 text-success' },
  };

  ngOnInit(): void {
    this.announcementsApi.list().subscribe({
      next: (items) => {
        this.announcements.set(items.slice(0, 3));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? 'تعذر تحميل البيانات');
        this.loading.set(false);
      },
    });
  }

  protected date(iso: string): string {
    return formatDate(iso);
  }
}
