import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideAngularModule,
  LucideIconData,
  ChevronLeft,
  Megaphone,
  Calendar,
  AlertTriangle,
} from 'lucide-angular';
import { Announcement, AnnouncementType } from '../../../core/models';
import { formatDate } from '../../../core/format';

const NEW_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-announcements-list',
  imports: [LucideAngularModule, TranslatePipe],
  templateUrl: './announcements-list.html',
})
export class AnnouncementsList {
  readonly announcements = input.required<Announcement[]>();

  protected readonly icons = {
    chevronLeft: ChevronLeft,
    calendar: Calendar,
  };

  protected readonly formatDate = formatDate;

  protected readonly typeConfig: Record<AnnouncementType, { icon: LucideIconData; class: string }> = {
    General: { icon: Megaphone, class: 'bg-primary/10 text-primary' },
    Urgent: { icon: AlertTriangle, class: 'bg-destructive/10 text-destructive' },
    Financial: { icon: Megaphone, class: 'bg-success/10 text-success' },
  };

  protected isNew(announcement: Announcement): boolean {
    return Date.now() - new Date(announcement.createdAt).getTime() < NEW_WINDOW_MS;
  }
}
