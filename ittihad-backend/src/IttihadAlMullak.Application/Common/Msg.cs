using System.Globalization;

namespace IttihadAlMullak.Application.Common;

/// <summary>
/// كتالوج رسائل الـ API مترجم (عربي/إنجليزي).
/// اللغة بتتحدد من هيدر Accept-Language عن طريق RequestLocalization في الـ Api.
/// لإضافة لغة جديدة: زوّد عمود في الكتالوج وسجلها في Program.cs.
/// </summary>
public static class Msg
{
    private static readonly Dictionary<string, (string Ar, string En)> Catalog = new()
    {
        ["InvalidCredentials"] = ("رقم الهاتف أو كلمة المرور غير صحيحة", "Invalid phone number or password"),
        ["AccountSuspended"] = ("الحساب موقوف، تواصل مع الإدارة", "Account suspended, contact management"),
        ["InvalidSession"] = ("جلسة غير صالحة، سجّل الدخول من جديد", "Invalid session, please login again"),
        ["UserNotFound"] = ("المستخدم غير موجود", "User not found"),
        ["WrongCurrentPassword"] = ("كلمة المرور الحالية غير صحيحة", "Current password is incorrect"),
        ["ApartmentNotFound"] = ("الشقة غير موجودة", "Apartment not found"),
        ["ApartmentExists"] = ("الشقة {0} موجودة بالفعل", "Apartment {0} already exists"),
        ["NoApartments"] = ("لا توجد شقق لإصدار فواتير لها", "No apartments to invoice"),
        ["InvoiceNotFound"] = ("الفاتورة غير موجودة", "Invoice not found"),
        ["NotYourInvoice"] = ("لا يمكنك الدفع على فاتورة لا تخصك", "You cannot pay an invoice that is not yours"),
        ["AlreadyPaid"] = ("الفاتورة مدفوعة بالكامل بالفعل", "Invoice is already fully paid"),
        ["AmountExceedsRemaining"] = ("المبلغ أكبر من المتبقي ({0} ج.م)", "Amount exceeds the remaining balance ({0} EGP)"),
        ["ExpenseNotFound"] = ("المصروف غير موجود", "Expense not found"),
        ["MaintenanceNotFound"] = ("طلب الصيانة غير موجود", "Maintenance request not found"),
        ["NotYourRequest"] = ("لا يمكنك عرض طلب لا يخصك", "You cannot view a request that is not yours"),
        ["NotYourRequestPhotos"] = ("لا يمكنك إضافة صور لطلب لا يخصك", "You cannot add photos to a request that is not yours"),
        ["MaxPhotos"] = ("الحد الأقصى ٥ صور للطلب الواحد", "Maximum 5 photos per request"),
        ["RejectionReasonRequired"] = ("سبب الرفض مطلوب", "Rejection reason is required"),
        ["AnnouncementNotFound"] = ("الإعلان غير موجود", "Announcement not found"),
        ["PhoneTaken"] = ("رقم الهاتف مسجل بالفعل", "Phone number is already registered"),
        ["CannotDeactivateSelf"] = ("لا يمكنك إيقاف حسابك الشخصي", "You cannot deactivate your own account"),
        ["BuildingNotFound"] = ("العمارة غير موجودة", "Building not found"),
        ["NotBuildingMember"] = ("أنت لست عضواً في هذه العمارة", "You are not a member of this building"),
        ["AdminOnly"] = ("هذا الإجراء متاح لمدير العمارة فقط", "This action is available to building admins only"),
        ["PhoneNotRegistered"] = ("رقم الهاتف غير مسجّل، تواصل مع إدارة العمارة", "Phone number is not registered, contact building management"),
        ["EmailNotRegistered"] = ("لا يوجد إيميل مسجّل على هذا الحساب", "No email is registered on this account"),
        ["InvalidWebhookSignature"] = ("توقيع غير صالح", "Invalid signature"),
        ["OtpCooldown"] = ("برجاء الانتظار قليلاً قبل طلب كود جديد", "Please wait a bit before requesting a new code"),
        ["InvalidOtp"] = ("الكود غير صحيح", "Invalid code"),
        ["OtpExpired"] = ("انتهت صلاحية الكود، اطلب كود جديد", "The code has expired, request a new one"),
        ["TooManyOtpAttempts"] = ("عدد كبير من المحاولات الخاطئة، اطلب كود جديد", "Too many incorrect attempts, request a new code"),
        ["EmptyMessage"] = ("لا يمكن إرسال رسالة فارغة", "Cannot send an empty message"),
        ["ConversationNotFound"] = ("المحادثة غير موجودة", "Conversation not found"),
        ["NotYourConversation"] = ("لا يمكنك الوصول لمحادثة لا تخصك", "You cannot access a conversation that is not yours"),
        ["NoCounterpart"] = ("لا يوجد طرف آخر للمحادثة", "No counterpart for the conversation"),
        ["NotificationNotFound"] = ("الإشعار غير موجود", "Notification not found"),
        ["UnsupportedFileType"] = ("نوع الملف غير مدعوم — الصور فقط (jpg, png, webp)", "Unsupported file type — images only (jpg, png, webp)"),
        ["FileTooLarge"] = ("حجم الصورة أكبر من 5 ميجابايت", "Image is larger than 5MB"),
        ["UnexpectedError"] = ("حدث خطأ غير متوقع", "An unexpected error occurred"),
    };

    public static string Get(string key)
    {
        var (ar, en) = Catalog[key];
        return CultureInfo.CurrentUICulture.TwoLetterISOLanguageName == "en" ? en : ar;
    }

    public static string Format(string key, params object[] args)
        => string.Format(Get(key), args);
}
