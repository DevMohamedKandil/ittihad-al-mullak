import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
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
  Languages,
  Users,
} from 'lucide-angular';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, LucideAngularModule, TranslatePipe],
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = {
    building2: Building2,
    chevronLeft: ChevronLeft,
    checkCircle2: CheckCircle2,
    smartphone: Smartphone,
    languages: Languages,
    users: Users,
  };

  protected readonly year = new Date().getFullYear();

  protected readonly features = [
    { icon: Receipt, title: this.i18n.t('landing.feature1Title'), description: this.i18n.t('landing.feature1Desc') },
    { icon: CreditCard, title: this.i18n.t('landing.feature2Title'), description: this.i18n.t('landing.feature2Desc') },
    { icon: Wrench, title: this.i18n.t('landing.feature3Title'), description: this.i18n.t('landing.feature3Desc') },
    { icon: Bell, title: this.i18n.t('landing.feature4Title'), description: this.i18n.t('landing.feature4Desc') },
    { icon: MessageSquare, title: this.i18n.t('landing.feature5Title'), description: this.i18n.t('landing.feature5Desc') },
    { icon: Shield, title: this.i18n.t('landing.feature6Title'), description: this.i18n.t('landing.feature6Desc') },
  ];

  protected readonly stats = [
    { value: '٥٠٠+', label: this.i18n.t('landing.statBuildings') },
    { value: '١٠,٠٠٠+', label: this.i18n.t('landing.statUsers') },
    { value: '٩٨%', label: this.i18n.t('landing.statSatisfaction') },
    { value: '٢٤/٧', label: this.i18n.t('landing.statSupport') },
  ];

  protected readonly userTypes = [
    {
      icon: Users,
      title: this.i18n.t('role.Admin'),
      description: this.i18n.t('landing.adminDesc'),
      cardClass: 'border-primary/20 hover:border-primary',
      iconWrapClass: 'bg-primary/10',
      iconClass: 'text-primary',
      items: [this.i18n.t('landing.adminItem1'), this.i18n.t('landing.adminItem2'), this.i18n.t('landing.adminItem3')],
    },
    {
      icon: Building2,
      title: this.i18n.t('landing.ownersTitle'),
      description: this.i18n.t('landing.ownersDesc'),
      cardClass: 'border-secondary/20 hover:border-secondary',
      iconWrapClass: 'bg-secondary/10',
      iconClass: 'text-secondary',
      items: [this.i18n.t('landing.ownersItem1'), this.i18n.t('landing.ownersItem2'), this.i18n.t('landing.ownersItem3')],
    },
    {
      icon: Users,
      title: this.i18n.t('landing.tenantsTitle'),
      description: this.i18n.t('landing.tenantsDesc'),
      cardClass: 'border-muted-foreground/20 hover:border-muted-foreground',
      iconWrapClass: 'bg-muted',
      iconClass: 'text-muted-foreground',
      items: [this.i18n.t('landing.tenantsItem1'), this.i18n.t('landing.tenantsItem2'), this.i18n.t('landing.tenantsItem3')],
    },
  ];

  protected readonly egyptianFeatures = [
    { title: this.i18n.t('landing.fawry'), titleClass: 'text-primary', description: this.i18n.t('landing.fawryDesc') },
    { title: this.i18n.t('landing.whatsapp'), titleClass: 'text-success', description: this.i18n.t('landing.whatsappDesc') },
    { title: this.i18n.t('landing.sms'), titleClass: 'text-primary', description: this.i18n.t('landing.smsDesc') },
    { title: this.i18n.t('landing.arabic'), titleClass: 'text-foreground', description: this.i18n.t('landing.arabicDesc') },
  ];

  protected toggleLanguage(): void {
    this.i18n.toggle();
  }
}
