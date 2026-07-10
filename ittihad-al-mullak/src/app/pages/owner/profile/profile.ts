import { Component, computed, inject, signal } from '@angular/core';
import {
  LucideAngularModule,
  Home,
  Phone,
  Mail,
  Bell,
  MessageSquare,
  Shield,
  LogOut,
  ChevronLeft,
  Camera,
  Pencil,
  Moon,
  Globe,
  HelpCircle,
  FileText,
} from 'lucide-angular';
import { OwnerHeader } from '../header';
import { AuthService } from '../../../core/auth.service';
import { OwnerApi } from '../../../core/api.services';
import { OwnerSummary } from '../../../core/models';

type NotificationKey = 'bills' | 'maintenance' | 'announcements' | 'whatsapp' | 'sms';

@Component({
  selector: 'app-owner-profile',
  imports: [OwnerHeader, LucideAngularModule],
  templateUrl: './profile.html',
})
export class OwnerProfile {
  private readonly auth = inject(AuthService);
  private readonly ownerApi = inject(OwnerApi);

  protected readonly icons = {
    home: Home,
    phone: Phone,
    mail: Mail,
    bell: Bell,
    messageSquare: MessageSquare,
    shield: Shield,
    logOut: LogOut,
    chevronLeft: ChevronLeft,
    camera: Camera,
    pencil: Pencil,
    moon: Moon,
    globe: Globe,
    helpCircle: HelpCircle,
    fileText: FileText,
  };

  protected readonly isEditProfileOpen = signal(false);

  protected readonly notifications = signal<Record<NotificationKey, boolean>>({
    bills: true,
    maintenance: true,
    announcements: true,
    whatsapp: true,
    sms: false,
  });

  protected readonly darkMode = signal(false);

  protected readonly user = this.auth.currentUser;
  protected readonly summary = signal<OwnerSummary | null>(null);

  protected readonly roleLabel = computed(() =>
    this.user()?.role === 'Tenant' ? 'مستأجر' : 'مالك',
  );

  protected readonly initial = computed(() => this.user()?.name?.charAt(0) ?? '');

  constructor() {
    this.ownerApi.summary().subscribe({
      next: (summary) => this.summary.set(summary),
      error: () => this.summary.set(null),
    });
  }

  protected toggleNotification(key: NotificationKey) {
    this.notifications.update((notifications) => ({
      ...notifications,
      [key]: !notifications[key],
    }));
  }

  protected toggleDarkMode() {
    this.darkMode.update((value) => !value);
  }

  protected openEditProfile() {
    this.isEditProfileOpen.set(true);
  }

  protected closeEditProfile() {
    this.isEditProfileOpen.set(false);
  }

  protected logout() {
    this.auth.logout();
  }
}
