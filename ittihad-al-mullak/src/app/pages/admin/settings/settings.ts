import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  LucideIconData,
  Building2,
  Bell,
  CreditCard,
  Shield,
  Palette,
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
} from 'lucide-angular';
import { SettingsApi } from '../../../core/api.services';

type Tab = 'building' | 'notifications' | 'payments' | 'security' | 'appearance';

@Component({
  selector: 'app-settings-page',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './settings.html',
})
export class SettingsPage {
  private readonly api = inject(SettingsApi);

  protected readonly icons = {
    building2: Building2,
    bell: Bell,
    creditCard: CreditCard,
    shield: Shield,
    palette: Palette,
    save: Save,
    phone: Phone,
    mail: Mail,
    mapPin: MapPin,
    globe: Globe,
  };

  protected readonly tabs: { id: Tab; label: string; icon: LucideIconData }[] = [
    { id: 'building', label: 'العمارة', icon: Building2 },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'payments', label: 'المدفوعات', icon: CreditCard },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'appearance', label: 'المظهر', icon: Palette },
  ];

  protected readonly activeTab = signal<Tab>('building');

  // Building (من الخادم)
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly saveMessage = signal<string | null>(null);

  protected readonly buildingCode = signal('');
  protected readonly buildingName = signal('');
  protected readonly address = signal('');
  protected readonly floorsCount = signal(0);
  protected readonly apartmentsCount = signal(0);
  protected readonly monthlySubscription = signal(0);
  protected readonly dueDay = signal(1);
  protected readonly phone = signal('');
  protected readonly whatsApp = signal('');
  protected readonly email = signal('');

  // Notifications (محلي فقط)
  protected readonly appNotifications = signal(true);
  protected readonly whatsappNotifications = signal(true);
  protected readonly smsNotifications = signal(false);
  protected readonly emailNotifications = signal(false);
  protected readonly autoReminders = signal(true);

  // Payments (محلي فقط)
  protected readonly fawryEnabled = signal(true);
  protected readonly cardsEnabled = signal(true);
  protected readonly bankTransferEnabled = signal(true);
  protected readonly cashEnabled = signal(true);
  protected readonly autoInvoices = signal(true);

  // Security (محلي فقط)
  protected readonly twoFactor = signal(false);
  protected readonly autoLogout = signal(true);
  protected readonly requireMixedCase = signal(true);
  protected readonly requireNumbers = signal(true);
  protected readonly requireSymbols = signal(false);

  // Appearance (محلي فقط)
  protected readonly hijriDate = signal(false);

  constructor() {
    this.load();
  }

  protected load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get().subscribe({
      next: (settings) => {
        this.buildingCode.set(settings.code);
        this.buildingName.set(settings.name);
        this.address.set(settings.address);
        this.floorsCount.set(settings.floorsCount);
        this.apartmentsCount.set(settings.apartmentsCount);
        this.monthlySubscription.set(settings.monthlySubscription);
        this.dueDay.set(settings.dueDay);
        this.phone.set(settings.phone ?? '');
        this.whatsApp.set(settings.whatsApp ?? '');
        this.email.set(settings.email ?? '');
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? 'تعذر تحميل البيانات');
        this.loading.set(false);
      },
    });
  }

  protected save() {
    if (this.saving()) return;
    this.saving.set(true);
    this.saveMessage.set(null);
    this.error.set(null);
    this.api
      .update({
        name: this.buildingName(),
        address: this.address(),
        floorsCount: Number(this.floorsCount()),
        apartmentsCount: Number(this.apartmentsCount()),
        monthlySubscription: Number(this.monthlySubscription()),
        dueDay: Number(this.dueDay()),
        phone: this.phone() || null,
        whatsApp: this.whatsApp() || null,
        email: this.email() || null,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.saveMessage.set('تم الحفظ بنجاح');
          setTimeout(() => this.saveMessage.set(null), 3000);
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err.error?.title ?? 'تعذر حفظ الإعدادات');
        },
      });
  }
}
