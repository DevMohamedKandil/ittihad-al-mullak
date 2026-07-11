namespace IttihadAlMullak.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;
    /// <summary>العمارة الأساسية (اللي بينضم لها المستخدم أول مرة) — العمارة النشطة الفعلية بتيجي من التوكن، مش من هنا.</summary>
    public int? BuildingId { get; set; }
    public Building? Building { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
    public ICollection<UserBuilding> UserBuildings { get; set; } = [];
}

/// <summary>عضوية المستخدم في عمارة — بيسمح لنفس الحساب (غالباً أدمن) يدير أكتر من عمارة ويتنقل بينها.</summary>
public class UserBuilding
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int BuildingId { get; set; }
    public Building Building { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class RefreshToken
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string Token { get; set; } = string.Empty;
    /// <summary>العمارة اللي كانت نشطة وقت إصدار التوكن ده — بتفضل ثابتة عبر عمليات الـ refresh لنفس الجلسة.</summary>
    public int? ActiveBuildingId { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsActive => RevokedAt is null && ExpiresAt > DateTime.UtcNow;
}

// توكن جهاز الموبايل — جاهز للـ Push Notifications لاحقاً
public class DeviceToken
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string Token { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty; // android | ios | web
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
