namespace IttihadAlMullak.Infrastructure.Push;

/// <summary>
/// إعدادات Firebase — بتتحط في dotnet user-secrets محليًا وenvironment variables في الإنتاج، مش appsettings.
/// dotnet user-secrets set "Firebase:ServiceAccountJson" "{...محتوى ملف الـ Service Account كامل...}"
/// </summary>
public class FirebaseOptions
{
    public const string SectionName = "Firebase";

    /// <summary>المحتوى الكامل لملف مفتاح الـ Service Account (JSON) اللي بينزل من إعدادات مشروع Firebase.</summary>
    public string ServiceAccountJson { get; set; } = string.Empty;

    public bool IsConfigured => !string.IsNullOrWhiteSpace(ServiceAccountJson);
}
