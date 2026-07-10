// ملف الترجمة العربية — أضف أي نص جديد هنا وفي en.ts بنفس المفتاح
export const AR = {
  // عام
  'app.name': 'اتحاد الملاك',
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.add': 'إضافة',
  'common.edit': 'تعديل',
  'common.delete': 'حذف',
  'common.search': 'بحث...',
  'common.viewAll': 'عرض الكل',
  'common.loading': 'جاري التحميل...',
  'common.noData': 'لا توجد بيانات',
  'common.error': 'تعذر تحميل البيانات',
  'common.logout': 'تسجيل الخروج',
  'common.login': 'تسجيل الدخول',
  'common.egp': 'ج.م',

  // الأدوار
  'role.Admin': 'رئيس اللجنة',
  'role.Owner': 'مالك',
  'role.Tenant': 'مستأجر',

  // حالات الدفع
  'payment.paid': 'مدفوع',
  'payment.partial': 'جزئي',
  'payment.unpaid': 'غير مدفوع',
  'payment.overdue': 'متأخر',
  'payment.payNow': 'ادفع الآن',

  // طرق الدفع
  'method.Cash': 'كاش',
  'method.Fawry': 'فوري',
  'method.Card': 'بطاقة',
  'method.BankTransfer': 'تحويل بنكي',

  // حالات الصيانة
  'maintenance.Pending': 'قيد الانتظار',
  'maintenance.InProgress': 'جاري التنفيذ',
  'maintenance.Completed': 'مكتمل',
  'maintenance.Rejected': 'مرفوض',
  'priority.Low': 'منخفضة',
  'priority.Medium': 'متوسطة',
  'priority.High': 'عاجلة',

  // أنواع الإعلانات
  'announcement.General': 'عام',
  'announcement.Urgent': 'عاجل',
  'announcement.Financial': 'مالي',

  // التنقل
  'nav.dashboard': 'لوحة التحكم',
  'nav.apartments': 'الشقق',
  'nav.invoices': 'الفواتير',
  'nav.maintenance': 'طلبات الصيانة',
  'nav.announcements': 'الإعلانات',
  'nav.users': 'المستخدمين',
  'nav.settings': 'الإعدادات',
  'nav.home': 'الرئيسية',
  'nav.messages': 'المحادثات',
  'nav.profile': 'حسابي',
} as const;

export type TranslationKey = keyof typeof AR;
