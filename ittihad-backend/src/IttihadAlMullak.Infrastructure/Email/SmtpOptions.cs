namespace IttihadAlMullak.Infrastructure.Email;

/// <summary>
/// إعدادات SMTP — بتتحط في dotnet user-secrets محليًا وenvironment variables في الإنتاج، مش appsettings مباشرة.
/// dotnet user-secrets set "Smtp:Username" "you@gmail.com"
/// dotnet user-secrets set "Smtp:Password" "app-password-not-your-real-password"
/// (لو Gmail: لازم "App Password" مخصص من إعدادات الأمان، مش كلمة مرور الحساب نفسها)
/// </summary>
public class SmtpOptions
{
    public const string SectionName = "Smtp";

    public string Host { get; set; } = "smtp.gmail.com";
    public int Port { get; set; } = 587;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string DisplayName { get; set; } = "اتحاد الملاك";

    public bool IsConfigured => !string.IsNullOrWhiteSpace(Username) && !string.IsNullOrWhiteSpace(Password);
}
