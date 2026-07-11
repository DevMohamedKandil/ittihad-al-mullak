using System.Text.Json;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;

namespace IttihadAlMullak.Application.Tests.Fakes;

public class FakePaymentGateway : IPaymentGateway
{
    public string CheckoutUrlToReturn { get; set; } = "https://accept.paymob.com/unifiedcheckout/?fake=1";
    public bool SignatureIsValid { get; set; } = true;
    public string? LastSpecialReference { get; private set; }

    public Task<string> ChargeAsync(decimal amount, PaymentMethod method, string payerPhone, CancellationToken ct = default)
        => Task.FromResult($"FAKE-{Guid.NewGuid():N}"[..14]);

    public Task<string> CreateCheckoutAsync(
        decimal amount, string specialReference, string payerName, string payerPhone, string? payerEmail,
        CancellationToken ct = default)
    {
        LastSpecialReference = specialReference;
        return Task.FromResult(CheckoutUrlToReturn);
    }

    public bool VerifyWebhookSignature(JsonElement transaction, string providedHmac) => SignatureIsValid;
}
