using System.Text.Json;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

/// <summary>
/// نداءات خارجية من بوابات الدفع — بلا [Authorize] عادي لأنها مش جايه من مستخدم مسجّل دخول،
/// الحماية بدل كده بتوقيع HMAC بيتحقق منه IPaymentGateway.VerifyWebhookSignature.
/// </summary>
[ApiController]
[Route("api/v1/webhooks")]
[AllowAnonymous]
public class WebhooksController(IInvoiceService invoices) : ControllerBase
{
    [HttpPost("paymob")]
    public async Task<IActionResult> Paymob([FromQuery] string hmac, CancellationToken ct)
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync(ct);
        using var doc = JsonDocument.Parse(body);
        var transaction = doc.RootElement.TryGetProperty("obj", out var obj) ? obj : doc.RootElement;

        await invoices.HandlePaymentWebhookAsync(transaction, hmac, ct);
        return Ok();
    }
}
