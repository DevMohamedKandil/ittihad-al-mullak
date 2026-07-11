// أدوات تنسيق مشتركة — بتتبع لغة الواجهة الحالية (عربي/إنجليزي)

const LANG_KEY = 'ittihad_lang';

function currentLocale(): 'ar-EG' | 'en-US' {
  return localStorage.getItem(LANG_KEY) === 'en' ? 'en-US' : 'ar-EG';
}

export function formatCurrency(amount: number): string {
  const locale = currentLocale();
  const currencyWord = locale === 'ar-EG' ? 'ج.م' : 'EGP';
  return `${amount.toLocaleString(locale)} ${currencyWord}`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '-';
  return new Intl.DateTimeFormat(currentLocale(), { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '-';
  return new Intl.DateTimeFormat(currentLocale(), {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

/** "منذ ساعتين" / "2 hours ago" حسب لغة الواجهة */
export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return '-';
  const locale = currentLocale();
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (seconds < 60) return locale === 'ar-EG' ? 'الآن' : 'now';
  if (seconds < 3600) return rtf.format(-Math.round(seconds / 60), 'minute');
  if (seconds < 86400) return rtf.format(-Math.round(seconds / 3600), 'hour');
  if (seconds < 2592000) return rtf.format(-Math.round(seconds / 86400), 'day');
  return formatDate(iso);
}

/** تنزيل بيانات كملف CSV (بدعم العربي في Excel عبر BOM) */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const content = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
