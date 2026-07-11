namespace IttihadAlMullak.Infrastructure.Sms;

/// <summary>
/// إعدادات SMS Misr — بتتحط في dotnet user-secrets محليًا وenvironment variables في الإنتاج، مش appsettings مباشرة.
/// dotnet user-secrets set "SmsMisr:Username" "..."   (وبالمثل Password / SenderToken / OtpTemplateToken)
/// </summary>
public class SmsMisrOptions
{
    public const string SectionName = "SmsMisr";

    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    /// <summary>Sender Token المسجّل في حساب SMS Misr.</summary>
    public string SenderToken { get; set; } = string.Empty;
    /// <summary>Template Token المعتمد مسبقًا لرسائل الـ OTP.</summary>
    public string OtpTemplateToken { get; set; } = string.Empty;
    /// <summary>"2" = بيئة تجريبية (الافتراضي)، "1" = بيئة حقيقية بعد اعتماد الحساب.</summary>
    public string Environment { get; set; } = "2";

    public bool IsConfigured => !string.IsNullOrWhiteSpace(Username) && !string.IsNullOrWhiteSpace(Password);
}
