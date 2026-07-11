import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  Home,
  Receipt,
  Wrench,
  Bell,
  Users,
  Settings,
  Shield,
  LogOut,
  Languages,
  Menu,
  X,
  Building2,
} from 'lucide-angular';
import { AuthService } from '../../core/auth.service';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
})
export class AdminSidebar {
  private readonly auth = inject(AuthService);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    logOut: LogOut,
    languages: Languages,
    menu: Menu,
    x: X,
    building2: Building2,
  };

  protected readonly isOpen = signal(false);

  protected readonly userName = computed(() => this.auth.currentUser()?.name ?? '');

  protected readonly userInitials = computed(() => this.userName().slice(0, 2));

  protected readonly roleLabel = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role ? this.i18n.t(`role.${role}`) : '';
  });

  protected readonly navItems = [
    { label: this.i18n.t('nav.dashboard'), href: '/admin', icon: LayoutDashboard, exact: true },
    { label: this.i18n.t('nav.apartments'), href: '/admin/apartments', icon: Home, exact: false },
    { label: this.i18n.t('nav.invoices'), href: '/admin/invoices', icon: Receipt, exact: false },
    { label: this.i18n.t('nav.maintenance'), href: '/admin/maintenance', icon: Wrench, exact: false },
    { label: this.i18n.t('nav.announcements'), href: '/admin/announcements', icon: Bell, exact: false },
    { label: this.i18n.t('nav.users'), href: '/admin/users', icon: Users, exact: false },
    { label: this.i18n.t('nav.permissions'), href: '/admin/permissions', icon: Shield, exact: false },
    { label: this.i18n.t('nav.settings'), href: '/admin/settings', icon: Settings, exact: false },
  ];

  protected toggle() {
    this.isOpen.update((open) => !open);
  }

  protected close() {
    this.isOpen.set(false);
  }

  protected toggleLanguage() {
    this.i18n.toggle();
  }

  protected logout() {
    this.auth.logout();
  }
}
