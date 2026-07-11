using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using Microsoft.Extensions.Options;

namespace IttihadAlMullak.Infrastructure.Payments;

/// <summary>
/// تكامل حقيقي مع Paymob (v1 Intention API) — أكبر بوابة دفع إلكتروني في مصر (بطاقات + محافظ + فوري).
/// تفاصيل الـ endpoint اتأكدت من الـ Postman Collection الرسمية لـ Paymob (github.com/PaymobAccept)
/// وقت الكتابة. الدفع الحقيقي بيتم بإعادة توجيه المستخدم لصفحة الدفع (CreateCheckoutAsync)،
/// والتأكيد النهائي بيجي لاحقًا عن طريق webhook (VerifyWebhookSignature + InvoiceService.HandlePaymentWebhookAsync) —
/// مش Charge فوري زي ChargeAsync، عشان كده ChargeAsync مش مدعومة هنا.
///
/// ⚠️ مهم: مسار order.merchant_order_id في جسم الـ webhook اتحدد من التوثيق العام ولسه محتاج
/// تأكيد فعلي من أول webhook حقيقي في بيئة Paymob التجريبية (Sandbox) قبل الاعتماد عليه في الإنتاج.
///
/// محتاج: dotnet user-secrets set "Paymob:SecretKey/PublicKey/HmacSecret/IntegrationId" "..."
/// </summary>
public class PaymobGateway(HttpClient http, IOptions<PaymobOptions> options) : IPaymentGateway
{
    // ترتيب الحقول ده أساسي لحساب الـ HMAC — لازم يفضل بالظبط زي ما Paymob موثّقه (ترتيب أبجدي لأسماء الحقول)
    private static readonly string[] HmacFieldOrder =
    [
        "amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction", "id",
        "integration_id", "is_3d_secure", "is_auth", "is_capture", "is_refunded", "is_standalone_payment",
        "is_voided", "order.id", "owner", "pending", "source_data.pan", "source_data.sub_type",
        "source_data.type", "success",
    ];

    public Task<string> ChargeAsync(decimal amount, PaymentMethod method, string payerPhone, CancellationToken ct = default)
        => throw new BusinessRuleException("Paymob بيستخدم CreateCheckoutAsync (إعادة توجيه + webhook)، مش شحن فوري");

    public async Task<string> CreateCheckoutAsync(
        decimal amount, string specialReference, string payerName, string payerPhone, string? payerEmail,
        CancellationToken ct = default)
    {
        var settings = options.Value;
        var nameParts = payerName.Trim().Split(' ', 2);
        var firstName = nameParts[0];
        var lastName = nameParts.Length > 1 ? nameParts[1] : nameParts[0];

        var request = new HttpRequestMessage(HttpMethod.Post, $"{settings.BaseUrl}/v1/intention/");
        request.Headers.Add("Authorization", $"Token {settings.SecretKey}");
        request.Content = JsonContent.Create(new
        {
            amount = (int)(amount * 100), // amount_cents
            currency = "EGP",
            payment_methods = new[] { settings.IntegrationId },
            items = Array.Empty<object>(),
            billing_data = new
            {
                first_name = firstName,
                last_name = lastName,
                phone_number = payerPhone,
                email = payerEmail ?? "resident@ittihad-almullak.app",
                apartment = "NA",
                street = "NA",
                building = "NA",
                city = "NA",
                country = "EG",
                floor = "NA",
                state = "NA",
            },
            special_reference = specialReference,
        });

        using var response = await http.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<PaymobIntentionResponse>(cancellationToken: ct);
        if (string.IsNullOrWhiteSpace(result?.ClientSecret))
            throw new InvalidOperationException("فشل إنشاء عملية دفع Paymob — لا يوجد client_secret في الرد");

        return $"{settings.BaseUrl}/unifiedcheckout/?publicKey={settings.PublicKey}&clientSecret={result.ClientSecret}";
    }

    public bool VerifyWebhookSignature(JsonElement transaction, string providedHmac)
    {
        var settings = options.Value;
        var concatenated = string.Concat(HmacFieldOrder.Select(path => ReadFieldAsString(transaction, path)));

        var keyBytes = Encoding.UTF8.GetBytes(settings.HmacSecret);
        var messageBytes = Encoding.UTF8.GetBytes(concatenated);
        var hash = HMACSHA512.HashData(keyBytes, messageBytes);
        var computed = Convert.ToHexStringLower(hash);

        return string.Equals(computed, providedHmac, StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>بيقرا حقل ممكن يكون متداخل (زي order.id) ويحوّل القيمة لنص بنفس تمثيل Paymob (true/false lowercase للـ boolean).</summary>
    private static string ReadFieldAsString(JsonElement root, string dottedPath)
    {
        var current = root;
        foreach (var segment in dottedPath.Split('.'))
        {
            if (!current.TryGetProperty(segment, out var next)) return string.Empty;
            current = next;
        }

        return current.ValueKind switch
        {
            JsonValueKind.True => "true",
            JsonValueKind.False => "false",
            JsonValueKind.Null => string.Empty,
            JsonValueKind.Number => current.GetRawText(),
            _ => current.GetString() ?? string.Empty,
        };
    }

    private class PaymobIntentionResponse
    {
        [JsonPropertyName("client_secret")]
        public string? ClientSecret { get; set; }
    }
}
