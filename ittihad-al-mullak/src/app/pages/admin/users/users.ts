import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideAngularModule,
  LucideIconData,
  Plus,
  Search,
  Filter,
  MoreVertical,
  User as UserIcon,
  Shield,
  Home,
  Phone,
  Mail,
  Edit,
  Trash2,
  Key,
  UserCog,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-angular';
import { ApartmentsApi, UsersApi } from '../../../core/api.services';
import { Apartment, UserListItem, UserRole } from '../../../core/models';
import { formatDate } from '../../../core/format';
import { TranslationService } from '../../../core/i18n/translation.service';
import { EmptyState } from '../../../shared/empty-state';

type Tab = 'all' | 'Admin' | 'Owner' | 'Tenant';

@Component({
  selector: 'app-users-page',
  imports: [FormsModule, LucideAngularModule, TranslatePipe, EmptyState],
  templateUrl: './users.html',
})
export class UsersPage {
  private readonly api = inject(UsersApi);
  private readonly apartmentsApi = inject(ApartmentsApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    plus: Plus,
    search: Search,
    filter: Filter,
    moreVertical: MoreVertical,
    user: UserIcon,
    shield: Shield,
    home: Home,
    phone: Phone,
    mail: Mail,
    edit: Edit,
    trash2: Trash2,
    key: Key,
    userCog: UserCog,
    checkCircle: CheckCircle,
    xCircle: XCircle,
    clock: Clock,
  };

  protected readonly users = signal<UserListItem[]>([]);
  protected readonly apartments = signal<Apartment[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly roleLabels: Record<UserRole, string> = {
    Admin: this.i18n.t('role.Admin'),
    Owner: this.i18n.t('role.Owner'),
    Tenant: this.i18n.t('role.Tenant'),
  };

  protected readonly stats = computed(() => {
    const list = this.users();
    return [
      {
        label: this.i18n.t('usersAdmin.totalUsers'),
        value: list.length,
        icon: UserIcon,
        color: 'text-primary',
        bg: 'bg-primary/10',
      },
      {
        label: this.i18n.t('usersAdmin.admins'),
        value: list.filter((u) => u.role === 'Admin').length,
        icon: Shield,
        color: 'text-secondary',
        bg: 'bg-secondary/10',
      },
      {
        label: this.i18n.t('usersAdmin.owners'),
        value: list.filter((u) => u.role === 'Owner').length,
        icon: Home,
        color: 'text-warning-foreground',
        bg: 'bg-warning/10',
      },
      {
        label: this.i18n.t('usersAdmin.tenants'),
        value: list.filter((u) => u.role === 'Tenant').length,
        icon: UserCog,
        color: 'text-success',
        bg: 'bg-success/10',
      },
    ];
  });

  protected readonly tabs = computed<{ id: Tab; label: string }[]>(() => {
    const list = this.users();
    return [
      { id: 'all', label: `${this.i18n.t('common.all')} (${list.length})` },
      { id: 'Admin', label: `${this.i18n.t('usersAdmin.admins')} (${list.filter((u) => u.role === 'Admin').length})` },
      { id: 'Owner', label: `${this.i18n.t('usersAdmin.owners')} (${list.filter((u) => u.role === 'Owner').length})` },
      {
        id: 'Tenant',
        label: `${this.i18n.t('usersAdmin.tenants')} (${list.filter((u) => u.role === 'Tenant').length})`,
      },
    ];
  });

  protected readonly searchQuery = signal('');
  protected readonly roleFilter = signal('all');
  protected readonly statusFilter = signal('all');
  protected readonly activeTab = signal<Tab>('all');
  protected readonly openMenuId = signal<number | null>(null);
  protected readonly selectedUser = signal<UserListItem | null>(null);

  // Add user dialog state
  protected readonly addDialogOpen = signal(false);
  protected readonly addName = signal('');
  protected readonly addPhone = signal('');
  protected readonly addEmail = signal('');
  protected readonly addRole = signal<UserRole>('Owner');
  protected readonly addApartmentId = signal<number | null>(null);
  protected readonly sendInvite = signal(true);
  protected readonly adding = signal(false);
  protected readonly addError = signal<string | null>(null);

  protected readonly visibleUsers = computed(() => {
    const query = this.searchQuery();
    const role = this.roleFilter();
    const status = this.statusFilter();
    const tab = this.activeTab();
    return this.users().filter((user) => {
      const matchesSearch =
        user.name.includes(query) || user.phone.includes(query) || (user.email ?? '').includes(query);
      const matchesRole = role === 'all' || user.role === role;
      const matchesStatus =
        status === 'all' || (status === 'active' && user.isActive) || (status === 'inactive' && !user.isActive);
      const matchesTab = tab === 'all' || user.role === tab;
      return matchesSearch && matchesRole && matchesStatus && matchesTab;
    });
  });

  protected readonly roleConfig: Record<UserRole, { icon: LucideIconData; class: string }> = {
    Admin: { icon: Shield, class: 'bg-primary/10 text-primary hover:bg-primary/20 border-0' },
    Owner: { icon: Home, class: 'bg-secondary/10 text-secondary hover:bg-secondary/20 border-0' },
    Tenant: { icon: UserIcon, class: 'text-foreground' },
  };

  protected readonly statusConfig: Record<'active' | 'inactive', { label: string; icon: LucideIconData; class: string }> = {
    active: {
      label: this.i18n.t('usersAdmin.active'),
      icon: CheckCircle,
      class: 'bg-success/10 text-success hover:bg-success/20 border-0',
    },
    inactive: {
      label: this.i18n.t('usersAdmin.inactive'),
      icon: XCircle,
      class: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-0',
    },
  };

  constructor() {
    this.load();
    this.apartmentsApi.list().subscribe({
      next: (items) => this.apartments.set(items),
      error: () => this.apartments.set([]),
    });
  }

  protected load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.list().subscribe({
      next: (items) => {
        this.users.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
        this.loading.set(false);
      },
    });
  }

  protected statusKey(user: UserListItem): 'active' | 'inactive' {
    return user.isActive ? 'active' : 'inactive';
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

  protected showDetails(user: UserListItem) {
    this.selectedUser.set(user);
    this.closeMenu();
  }

  protected toggleActive(user: UserListItem) {
    this.closeMenu();
    this.api.update(user.id, { isActive: !user.isActive }).subscribe({
      next: (updated) => this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u))),
      error: (err) => this.error.set(err.error?.title ?? this.i18n.t('usersAdmin.updateError')),
    });
  }

  protected openAddDialog() {
    this.addName.set('');
    this.addPhone.set('');
    this.addEmail.set('');
    this.addRole.set('Owner');
    this.addApartmentId.set(null);
    this.addError.set(null);
    this.addDialogOpen.set(true);
  }

  protected setApartmentId(value: number | null) {
    this.addApartmentId.set(value);
  }

  protected createUser() {
    if (!this.addName().trim() || !this.addPhone().trim() || this.adding()) return;
    this.adding.set(true);
    this.addError.set(null);
    this.api
      .create({
        name: this.addName().trim(),
        phone: this.addPhone().trim(),
        email: this.addEmail().trim() || undefined,
        password: '123456',
        role: this.addRole(),
        apartmentId: this.addRole() === 'Admin' ? null : this.addApartmentId(),
      })
      .subscribe({
        next: () => {
          this.adding.set(false);
          this.addDialogOpen.set(false);
          this.load();
        },
        error: (err) => {
          this.addError.set(err.error?.title ?? this.i18n.t('usersAdmin.addError'));
          this.adding.set(false);
        },
      });
  }
}
