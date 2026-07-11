using System.Text.Json;
using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;

namespace IttihadAlMullak.Infrastructure.Payments;

/// <summary>
/// بوابة دفع تجريبية — بترجع مرجع عملية وهمي بدل التكامل الحقيقي مع فوري/Paymob (PaymobGateway).
/// </summary>
public class MockPaymentGateway : IPaymentGateway
{
    public Task<string> ChargeAsync(decimal amount, PaymentMethod method, string payerPhone, CancellationToken ct = default)
    {
        var prefix = method switch
        {
            PaymentMethod.Fawry => "FWRY",
            PaymentMethod.Card => "CARD",
            PaymentMethod.BankTransfer => "BANK",
            _ => "CASH",
        };
        return Task.FromResult($"{prefix}-{Guid.NewGuid().ToString("N")[..10].ToUpperInvariant()}");
    }

    public Task<string> CreateCheckoutAsync(
        decimal amount, string specialReference, string payerName, string payerPhone, string? payerEmail,
        CancellationToken ct = default)
        => throw new BusinessRuleException("بوابة الدفع الحقيقية (Paymob) مش متصلة بعد — راجع dotnet user-secrets");

    public bool VerifyWebhookSignature(JsonElement transaction, string providedHmac) => false;
}
