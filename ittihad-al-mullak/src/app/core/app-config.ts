/**
 * إعدادات التطبيق وقت التشغيل — بتتقرا من public/config/api-config.json
 * (نفس نمط api-config.json في Afzaz): تقدر تغيّر عنوان الـ API بعد النشر
 * بتعديل الملف بس، من غير ما تعيد build.
 */
export interface AppConfigValues {
  apiUrl: string;
  filesUrl: string;
  timeoutInMinutes: number;
}

// القيم الافتراضية — بتتستبدل بمحتوى الملف عند الإقلاع (provideAppInitializer)
export const APP_CONFIG: AppConfigValues = {
  apiUrl: 'http://localhost:5301/api/v1',
  filesUrl: 'http://localhost:5301',
  timeoutInMinutes: 20,
};

export async function loadAppConfig(): Promise<void> {
  try {
    const response = await fetch('config/api-config.json', { cache: 'no-store' });
    if (response.ok) Object.assign(APP_CONFIG, await response.json());
  } catch {
    console.warn('api-config.json غير موجود — هنكمل بالقيم الافتراضية');
  }
}
