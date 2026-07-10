using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;

namespace IttihadAlMullak.Application.Interfaces;

/// <summary>إصدار وقراءة توكنات JWT — التنفيذ في Infrastructure.</summary>
public interface ITokenService
{
    string CreateAccessToken(User user);
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
