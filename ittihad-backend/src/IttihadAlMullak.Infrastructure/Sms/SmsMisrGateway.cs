using System.Net.Http.Json;
using System.Text.Json.Serialization;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.Extensions.Options;

namespace IttihadAlMullak.Infrastructure.Sms;

/// <summary>
/// تنفيذ حقيقي على مزوّد SMS Misr (smsmisr.com) — أكبر بوابات الـ SMS/OTP في مصر.
/// تفاصيل الـ endpoint اتأكدت من صفحة smsmisr.com نفسها وقت الكتابة؛ يُنصح بمراجعتها
/// من لوحة تحكم الحساب قبل التفعيل الفعلي لو المزوّد غيّر أي حاجة لاحقًا.
/// محتاج: dotnet user-secrets set "SmsMisr:Username/Password/SenderToken/OtpTemplateToken" "..."
/// </summary>
public class SmsMisrGateway(HttpClient http, IOptions<SmsMisrOptions> options) : ISmsGateway
{
    private const string OtpEndpoint = "https://smsmisr.com/api/OTP/";
    private const string SuccessCode = "4901";

    public async Task SendOtpAsync(string phone, string otpCode, CancellationToken ct = default)
    {
        var settings = options.Value;
        var payload = new Dictionary<string, string>
        {
            ["environment"] = settings.Environment,
            ["username"] = settings.Username,
            ["password"] = settings.Password,
            ["sender"] = settings.SenderToken,
            ["mobile"] = ToInternationalFormat(phone),
            ["template"] = settings.OtpTemplateToken,
            ["otp"] = otpCode,
        };

        using var response = await http.PostAsync(OtpEndpoint, new FormUrlEncodedContent(payload), ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<SmsMisrResponse>(cancellationToken: ct);
        if (result?.Code != SuccessCode)
            throw new InvalidOperationException($"فشل إرسال SMS Misr OTP — code={result?.Code}");
    }

    /// <summary>SMS Misr بيحتاج الرقم بصيغة دولية بدون علامة + (مثال: 01012345678 → 201012345678).</summary>
    private static string ToInternationalFormat(string phone)
    {
        var digits = phone.TrimStart('0');
        return $"20{digits}";
    }

    private class SmsMisrResponse
    {
        [JsonPropertyName("code")]
        public string? Code { get; set; }

        [JsonPropertyName("SMSID")]
        public string? SmsId { get; set; }
    }
}
