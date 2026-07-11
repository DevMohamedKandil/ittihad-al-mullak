import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  Home,
  Receipt,
  Wrench,
  MessageSquare,
  User,
} from 'lucide-angular';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-owner-mobile-nav',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './mobile-nav.html',
})
export class OwnerMobileNav {
  protected readonly i18n = inject(TranslationService);

  protected readonly navItems = [
    { label: this.i18n.t('nav.home'), href: '/owner', icon: Home, exact: true },
    { label: this.i18n.t('nav.invoices'), href: '/owner/bills', icon: Receipt, exact: false },
    { label: this.i18n.t('owner.nav.maintenance'), href: '/owner/maintenance', icon: Wrench, exact: false },
    { label: this.i18n.t('nav.messages'), href: '/owner/messages', icon: MessageSquare, exact: false },
    { label: this.i18n.t('nav.profile'), href: '/owner/profile', icon: User, exact: false },
  ];
}
