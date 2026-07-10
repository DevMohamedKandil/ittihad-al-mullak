using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;

namespace IttihadAlMullak.Infrastructure.Payments;

/// <summary>
/// بوابة دفع تجريبية — بترجع مرجع عملية وهمي.
/// التكامل الحقيقي مع فوري/Paymob هيكون class جديد لنفس IPaymentGateway
/// (محتاج حساب تاجر + مفاتيح API في appsettings).
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
}
