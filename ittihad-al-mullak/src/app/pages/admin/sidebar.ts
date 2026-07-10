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
  Menu,
  X,
  Building2,
} from 'lucide-angular';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
})
export class AdminSidebar {
  private readonly auth = inject(AuthService);

  protected readonly icons = {
    logOut: LogOut,
    menu: Menu,
    x: X,
    building2: Building2,
  };

  protected readonly isOpen = signal(false);

  protected readonly userName = computed(() => this.auth.currentUser()?.name ?? '');

  protected readonly userInitials = computed(() => this.userName().slice(0, 2));

  protected readonly roleLabel = computed(() => {
    switch (this.auth.currentUser()?.role) {
      case 'Admin':
        return 'رئيس اللجنة';
      case 'Owner':
        return 'مالك';
      case 'Tenant':
        return 'مستأجر';
      default:
        return '';
    }
  });

  protected readonly navItems = [
    { label: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'الشقق', href: '/admin/apartments', icon: Home, exact: false },
    { label: 'الفواتير', href: '/admin/invoices', icon: Receipt, exact: false },
    { label: 'طلبات الصيانة', href: '/admin/maintenance', icon: Wrench, exact: false },
    { label: 'الإعلانات', href: '/admin/announcements', icon: Bell, exact: false },
    { label: 'المستخدمين', href: '/admin/users', icon: Users, exact: false },
    { label: 'الصلاحيات', href: '/admin/permissions', icon: Shield, exact: false },
    { label: 'الإعدادات', href: '/admin/settings', icon: Settings, exact: false },
  ];

  protected toggle() {
    this.isOpen.update((open) => !open);
  }

  protected close() {
    this.isOpen.set(false);
  }

  protected logout() {
    this.auth.logout();
  }
}
