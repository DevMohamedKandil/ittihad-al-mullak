import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideAngularModule,
  LucideIconData,
  Plus,
  Search,
  MoreVertical,
  Bell,
  Megaphone,
  AlertTriangle,
  Info,
  Calendar,
  Users,
  Edit,
  Trash2,
  Eye,
  Send,
  Pin,
} from 'lucide-angular';
import { AnnouncementsApi } from '../../../core/api.services';
import { Announcement, AnnouncementType } from '../../../core/models';
import { formatDate } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-announcements-page',
  imports: [FormsModule, LucideAngularModule, TranslatePipe],
  templateUrl: './announcements.html',
})
export class AnnouncementsPage {
  private readonly api = inject(AnnouncementsApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    plus: Plus,
    search: Search,
    moreVertical: MoreVertical,
    bell: Bell,
    megaphone: Megaphone,
    alertTriangle: AlertTriangle,
    info: Info,
    calendar: Calendar,
    users: Users,
    edit: Edit,
    trash2: Trash2,
    eye: Eye,
    send: Send,
    pin: Pin,
  };

  protected readonly announcements = signal<Announcement[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly searchQuery = signal('');
  protected readonly typeFilter = signal('all');
  protected readonly openMenuId = signal<number | null>(null);

  // Create dialog state
  protected readonly dialogOpen = signal(false);
  protected readonly newTitle = signal('');
  protected readonly newContent = signal('');
  protected readonly newType = signal<AnnouncementType>('General');
  protected readonly newPinned = signal(false);
  protected readonly creating = signal(false);
  protected readonly createError = signal<string | null>(null);

  protected readonly typeLabels: Record<AnnouncementType, string> = {
    General: this.i18n.t('announcement.General'),
    Urgent: this.i18n.t('announcement.Urgent'),
    Financial: this.i18n.t('announcement.Financial'),
  };

  protected readonly stats = computed(() => {
    const list = this.announcements();
    const now = new Date();
    const thisMonth = list.filter((a) => {
      const d = new Date(a.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return [
      {
        label: this.i18n.t('announcementsAdmin.total'),
        value: list.length,
        icon: Megaphone,
        color: 'text-primary',
        bg: 'bg-primary/10',
      },
      {
        label: this.i18n.t('announcementsAdmin.pinned'),
        value: list.filter((a) => a.isPinned).length,
        icon: Pin,
        color: 'text-secondary',
        bg: 'bg-secondary/10',
      },
      {
        label: this.i18n.t('announcementsAdmin.thisMonth'),
        value: thisMonth,
        icon: Calendar,
        color: 'text-warning-foreground',
        bg: 'bg-warning/10',
      },
      {
        label: this.i18n.t('announcementsAdmin.urgent'),
        value: list.filter((a) => a.type === 'Urgent').length,
        icon: AlertTriangle,
        color: 'text-destructive',
        bg: 'bg-destructive/10',
      },
    ];
  });

  /** الخادم يعيد المثبتة أولاً — نكتفي بالفلترة */
  protected readonly sortedAnnouncements = computed(() => {
    const query = this.searchQuery();
    const type = this.typeFilter();
    return this.announcements().filter((ann) => {
      const matchesSearch = ann.title.includes(query) || ann.content.includes(query);
      const matchesType = type === 'all' || ann.type === type;
      return matchesSearch && matchesType;
    });
  });

  private readonly typeConfig: Record<AnnouncementType, { icon: LucideIconData; class: string }> = {
    Urgent: { icon: AlertTriangle, class: 'border-transparent bg-destructive text-destructive-foreground' },
    General: { icon: Megaphone, class: 'bg-primary/10 text-primary border-0' },
    Financial: { icon: Info, class: 'bg-warning/10 text-warning-foreground border-0' },
  };

  constructor() {
    this.load();
  }

  protected load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.list().subscribe({
      next: (items) => {
        this.announcements.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
        this.loading.set(false);
      },
    });
  }

  protected getTypeIcon(type: AnnouncementType): LucideIconData {
    return this.typeConfig[type]?.icon ?? Bell;
  }

  protected getTypeBadgeClass(type: AnnouncementType): string {
    return this.typeConfig[type]?.class ?? 'border-transparent bg-secondary text-secondary-foreground';
  }

  protected formatDate(date: string): string {
    return formatDate(date);
  }

  protected toggleMenu(id: number) {
    this.openMenuId.update((open) => (open === id ? null : id));
  }

  protected closeMenu() {
    this.openMenuId.set(null);
  }

  protected openCreateDialog() {
    this.newTitle.set('');
    this.newContent.set('');
    this.newType.set('General');
    this.newPinned.set(false);
    this.createError.set(null);
    this.dialogOpen.set(true);
  }

  protected createAnnouncement() {
    if (!this.newTitle().trim() || !this.newContent().trim() || this.creating()) return;
    this.creating.set(true);
    this.createError.set(null);
    this.api
      .create({
        title: this.newTitle().trim(),
        content: this.newContent().trim(),
        type: this.newType(),
        isPinned: this.newPinned(),
        scheduledAt: null,
      })
      .subscribe({
        next: () => {
          this.creating.set(false);
          this.dialogOpen.set(false);
          this.load();
        },
        error: (err) => {
          this.createError.set(err.error?.title ?? this.i18n.t('announcementsAdmin.publishError'));
          this.creating.set(false);
        },
      });
  }

  protected deleteAnnouncement(id: number) {
    this.closeMenu();
    this.api.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err.error?.title ?? this.i18n.t('announcementsAdmin.deleteError')),
    });
  }
}
