namespace IttihadAlMullak.Infrastructure.Payments;

/// <summary>
/// إعدادات Paymob — بتتحط في dotnet user-secrets محليًا وenvironment variables في الإنتاج، مش appsettings مباشرة.
/// dotnet user-secrets set "Paymob:SecretKey" "..."   (وبالمثل PublicKey / HmacSecret / IntegrationId)
/// المفاتيح دي بتتاخد من لوحة تحكم Paymob بعد فتح حساب تاجر واعتماده.
/// </summary>
public class PaymobOptions
{
    public const string SectionName = "Paymob";

    public string BaseUrl { get; set; } = "https://accept.paymob.com";
    public string SecretKey { get; set; } = string.Empty;
    public string PublicKey { get; set; } = string.Empty;
    /// <summary>سر مختلف عن SecretKey — بيتاخد من لوحة تحكم Paymob لغرض توقيع الـ webhook فقط.</summary>
    public string HmacSecret { get; set; } = string.Empty;
    /// <summary>Integration ID المعتمد لطريقة الدفع (بطاقة أو محفظة/فوري) — ممكن يبقى أكتر من واحد لاحقًا.</summary>
    public int IntegrationId { get; set; }

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(SecretKey) && !string.IsNullOrWhiteSpace(PublicKey) && !string.IsNullOrWhiteSpace(HmacSecret);
}
