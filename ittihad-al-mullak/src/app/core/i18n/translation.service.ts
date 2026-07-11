import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export type AppLanguage = 'ar' | 'en';

const LANG_KEY = 'ittihad_lang';

/**
 * غلاف حوالين ngx-translate (نفس مكتبة Afzaz):
 * - القواميس: ملفات JSON في public/i18n (تتعدل بعد النشر من غير build)
 * - في القوالب: {{ 'common.save' | translate }} (زي Afzaz بالظبط)
 * - في كود TS: i18n.t('common.save')
 * - تبديل اللغة بيحفظ الاختيار وبيعيد التحميل + بيقلب الاتجاه RTL/LTR
 * - الـ interceptor بيبعت اللغة للباك (Accept-Language) فرسائل الأخطاء مترجمة
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly translate = inject(TranslateService);

  readonly language = signal<AppLanguage>(readStoredLanguage());
  readonly isRtl = computed(() => this.language() === 'ar');
  readonly isEnglish = computed(() => this.language() === 'en');

  t(key: string, params?: Record<string, string | number>): string {
    return this.translate.instant(key, params);
  }

  setLanguage(language: AppLanguage): void {
    if (language === this.language()) return;
    localStorage.setItem(LANG_KEY, language);
    // إعادة تحميل: النصوص المتقيّمة وقت إنشاء المكونات بتتبني من جديد باللغة الجديدة
    window.location.reload();
  }

  toggle(): void {
    this.setLanguage(this.language() === 'ar' ? 'en' : 'ar');
  }
}

export function readStoredLanguage(): AppLanguage {
  return (localStorage.getItem(LANG_KEY) as AppLanguage) ?? 'ar';
}

/** بيتنادى عند الإقلاع: تحميل ملف الترجمة قبل عرض أي مكون + ضبط اتجاه الصفحة */
export async function loadTranslations(translate: TranslateService): Promise<void> {
  const language = readStoredLanguage();
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  translate.setFallbackLang('ar');
  await firstValueFrom(translate.use(language));
}
