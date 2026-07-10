import { Injectable, computed, signal } from '@angular/core';
import { AR, TranslationKey } from './ar';
import { EN } from './en';

export type AppLanguage = 'ar' | 'en';

const LANG_KEY = 'ittihad_lang';

/**
 * خدمة الترجمة:
 *   private readonly i18n = inject(TranslationService);
 *   {{ i18n.t('common.save') }}
 * تغيير اللغة بيغير اتجاه الصفحة (RTL/LTR) تلقائياً،
 * والـ interceptor بيبعت اللغة للباك في هيدر Accept-Language.
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly language = signal<AppLanguage>(this.readStored());
  readonly isRtl = computed(() => this.language() === 'ar');

  private readonly dictionaries: Record<AppLanguage, Record<TranslationKey, string>> = {
    ar: AR,
    en: EN,
  };

  constructor() {
    this.applyToDocument(this.language());
  }

  t(key: TranslationKey): string {
    return this.dictionaries[this.language()][key] ?? key;
  }

  setLanguage(language: AppLanguage): void {
    this.language.set(language);
    localStorage.setItem(LANG_KEY, language);
    this.applyToDocument(language);
  }

  toggle(): void {
    this.setLanguage(this.language() === 'ar' ? 'en' : 'ar');
  }

  private applyToDocument(language: AppLanguage): void {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }

  private readStored(): AppLanguage {
    return (localStorage.getItem(LANG_KEY) as AppLanguage) ?? 'ar';
  }
}
