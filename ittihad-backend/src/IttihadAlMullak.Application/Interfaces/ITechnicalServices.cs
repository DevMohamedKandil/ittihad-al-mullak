using System.Text.Json;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;

namespace IttihadAlMullak.Application.Interfaces;

/// <summary>إصدار وقراءة توكنات JWT — التنفيذ في Infrastructure.</summary>
public interface ITokenService
{
    string CreateAccessToken(User user, int? activeBuildingId = null);
    string CreateRefreshToken();
}

/// <summary>تشفير كلمات المرور — التنفيذ في Infrastructure.</summary>
public interface IPasswordHasherService
{
    string Hash(string password);
    bool Verify(string hash, string password);
}

/// <summary>تخزين الملفات المرفوعة (صور الصيانة...) — التنفيذ في Infrastructure.</summary>
public interface IFileStorage
{
    /// <returns>المسار العام للملف (مثال: /uploads/xyz.jpg)</returns>
    Task<string> SaveAsync(Stream content, string originalFileName, CancellationToken ct = default);
}

/// <summary>
/// بوابة الدفع الإلكتروني — التنفيذ الحالي Mock،
/// ولما يتوفر حساب تاجر (فوري/Paymob) بنكتب تنفيذ جديد لنفس العقد ونبدّله في الـ DI بس.
/// </summary>
public interface IPaymentGateway
{
    /// <returns>مرجع عملية الدفع (Transaction Reference)</returns>
    Task<string> ChargeAsync(decimal amount, PaymentMethod method, string payerPhone, CancellationToken ct = default);

    /// <summary>
    /// تسجيل دفعة أونلاين حقيقية (بطاقة/فوري إلكتروني) — بيرجع رابط صفحة دفع (checkout)
    /// المفروض نحوّل المستخدم ليها؛ التأكيد الفعلي بيجي بعدين عن طريق الـ webhook مش هنا مباشرة.
    /// </summary>
    Task<string> CreateCheckoutAsync(
        decimal amount, string specialReference, string payerName, string payerPhone, string? payerEmail,
        CancellationToken ct = default);

    /// <summary>التحقق من توقيع الـ webhook القادم من بوابة الدفع قبل الوثوق في محتواه.</summary>
    bool VerifyWebhookSignature(JsonElement transaction, string providedHmac);
}

/// <summary>
/// بوابة إرسال SMS — التنفيذ الافتراضي بيطبع الكود في اللوج (Console) للتطوير المحلي،
/// ولما يتوفر حساب مزوّد حقيقي (SMS Misr) بيتفعّل تلقائياً لو الإعدادات موجودة.
/// </summary>
public interface ISmsGateway
{
    /// <summary>إرسال كود OTP عبر قناة الـ OTP المخصصة عند المزوّد (أسرع وصول من رسالة نصية عادية).</summary>
    Task SendOtpAsync(string phone, string otpCode, CancellationToken ct = default);
}

/// <summary>
/// بوابة إرسال إيميل — قناة بديلة لكود OTP لمن يفضّل الإيميل على SMS (ولا يحتاج حساب مزوّد SMS مدفوع).
/// التنفيذ الافتراضي بيطبع الكود في اللوج، ولو إعدادات SMTP موجودة بيتفعّل الإرسال الحقيقي تلقائياً.
/// </summary>
public interface IEmailSender
{
    Task SendOtpAsync(string email, string otpCode, CancellationToken ct = default);
}

/// <summary>
/// إشعارات Push للموبايل/الويب عبر Firebase Cloud Messaging — التنفيذ الافتراضي بيسجّل في اللوج فقط،
/// ولو Service Account JSON موجود بيتفعّل الإرسال الحقيقي تلقائياً.
/// </summary>
public interface IPushNotificationSender
{
    Task SendAsync(IReadOnlyList<string> deviceTokens, string title, string body, CancellationToken ct = default);
}

/// <summary>
/// بيانات المستخدم الحالي من التوكن — التنفيذ في Api (من الـ HttpContext).
/// كل الخدمات بتعمل scoping بالعمارة من هنا (multi-tenant).
/// </summary>
public interface ICurrentUser
{
    int UserId { get; }
    UserRole Role { get; }
    int BuildingId { get; }
    bool IsAdmin { get; }
}
