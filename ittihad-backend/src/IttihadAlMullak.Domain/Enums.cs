namespace IttihadAlMullak.Domain;

public enum UserRole
{
    Admin = 1,   // لجنة الإدارة
    Owner = 2,   // مالك
    Tenant = 3,  // مستأجر
}

public enum InvoiceType
{
    Monthly = 1,      // اشتراك شهري
    Maintenance = 2,  // صيانة
    Special = 3,      // خاص
}

public enum InvoiceStatus
{
    Unpaid = 1,   // غير مدفوع
    Partial = 2,  // جزئي
    Paid = 3,     // مدفوع
}

public enum PaymentMethod
{
    Cash = 1,          // كاش
    Fawry = 2,         // فوري
    Card = 3,          // بطاقة
    BankTransfer = 4,  // تحويل بنكي
}

public enum MaintenanceStatus
{
    Pending = 1,     // قيد الانتظار
    InProgress = 2,  // جاري التنفيذ
    Completed = 3,   // مكتمل
    Rejected = 4,    // مرفوض
}

public enum MaintenancePriority
{
    Low = 1,     // منخفضة
    Medium = 2,  // متوسطة
    High = 3,    // عاجلة
}

public enum AnnouncementType
{
    General = 1,    // عام
    Urgent = 2,     // عاجل
    Financial = 3,  // مالي
}

public enum NotificationChannel
{
    InApp = 1,
    WhatsApp = 2,
    Sms = 3,
    Push = 4,
}
