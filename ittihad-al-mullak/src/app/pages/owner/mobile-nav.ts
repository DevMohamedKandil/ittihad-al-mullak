import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  Home,
  Receipt,
  Wrench,
  MessageSquare,
  User,
} from 'lucide-angular';

@Component({
  selector: 'app-owner-mobile-nav',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './mobile-nav.html',
})
export class OwnerMobileNav {
  protected readonly navItems = [
    { label: 'الرئيسية', href: '/owner', icon: Home, exact: true },
    { label: 'الفواتير', href: '/owner/bills', icon: Receipt, exact: false },
    { label: 'الصيانة', href: '/owner/maintenance', icon: Wrench, exact: false },
    { label: 'المحادثات', href: '/owner/messages', icon: MessageSquare, exact: false },
    { label: 'حسابي', href: '/owner/profile', icon: User, exact: false },
  ];
}
