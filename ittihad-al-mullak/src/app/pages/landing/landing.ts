import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Building2,
  Receipt,
  Wrench,
  Bell,
  Shield,
  CreditCard,
  MessageSquare,
  ChevronLeft,
  CheckCircle2,
  Smartphone,
  Users,
} from 'lucide-angular';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly icons = {
    building2: Building2,
    chevronLeft: ChevronLeft,
    checkCircle2: CheckCircle2,
    smartphone: Smartphone,
    users: Users,
  };

  protected readonly year = new Date().getFullYear();

  protected readonly features = [
    {
      icon: Receipt,
      title: 'إدارة الفواتير',
      description: 'إصدار ومتابعة الفواتير الشهرية والسنوية بسهولة',
    },
    {
      icon: CreditCard,
      title: 'الدفع الإلكتروني',
      description: 'دعم فوري وبطاقات الائتمان والتحويل البنكي',
    },
    {
      icon: Wrench,
      title: 'طلبات الصيانة',
      description: 'رفع ومتابعة طلبات الصيانة بشكل فوري',
    },
    {
      icon: Bell,
      title: 'الإعلانات والتنبيهات',
      description: 'إشعارات فورية عبر التطبيق وواتساب وSMS',
    },
    {
      icon: MessageSquare,
      title: 'التواصل المباشر',
      description: 'محادثات بين الملاك والإدارة ومجموعات خاصة',
    },
    {
      icon: Shield,
      title: 'أمان وخصوصية',
      description: 'حماية كاملة للبيانات وصلاحيات متعددة المستويات',
    },
  ];

  protected readonly stats = [
    { value: '٥٠٠+', label: 'عمارة' },
    { value: '١٠,٠٠٠+', label: 'مستخدم' },
    { value: '٩٨%', label: 'رضا العملاء' },
    { value: '٢٤/٧', label: 'دعم فني' },
  ];

  protected readonly userTypes = [
    {
      icon: Users,
      title: 'لجنة الإدارة',
      description: 'إدارة كاملة للعمارة والمالية والصيانة',
      cardClass: 'border-primary/20 hover:border-primary',
      iconWrapClass: 'bg-primary/10',
      iconClass: 'text-primary',
      items: ['إصدار الفواتير', 'إدارة الصيانة', 'التقارير المالية'],
    },
    {
      icon: Building2,
      title: 'ملاك الشقق',
      description: 'متابعة الفواتير والصيانة والتواصل',
      cardClass: 'border-secondary/20 hover:border-secondary',
      iconWrapClass: 'bg-secondary/10',
      iconClass: 'text-secondary',
      items: ['دفع الفواتير', 'طلبات الصيانة', 'التواصل المباشر'],
    },
    {
      icon: Users,
      title: 'المستأجرين',
      description: 'صلاحيات محدودة حسب احتياجاتهم',
      cardClass: 'border-muted-foreground/20 hover:border-muted-foreground',
      iconWrapClass: 'bg-muted',
      iconClass: 'text-muted-foreground',
      items: ['عرض الفواتير', 'طلبات الصيانة', 'الإعلانات'],
    },
  ];

  protected readonly egyptianFeatures = [
    { title: 'فوري', titleClass: 'text-primary', description: 'دفع عبر منافذ فوري' },
    { title: 'واتساب', titleClass: 'text-success', description: 'إشعارات عبر واتساب' },
    { title: 'SMS', titleClass: 'text-primary', description: 'رسائل نصية قصيرة' },
    { title: 'عربي', titleClass: 'text-foreground', description: 'واجهة عربية كاملة' },
  ];
}
