using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using IttihadAlMullak.Api.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/invoices")]
[Authorize]
public class InvoicesController(IInvoiceService invoices) : ControllerBase
{
    [HttpGet]
    [HasPermission("Invoices.View")]
    public Task<PagedResult<InvoiceDto>> List(
        [FromQuery] string? status,
        [FromQuery] string? period,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
        => invoices.ListAsync(status, period, search, page, pageSize, ct);

    [HttpGet("summary")]
    [HasPermission("Invoices.View")]
    public Task<InvoicesSummaryDto> Summary(CancellationToken ct)
        => invoices.GetSummaryAsync(ct);

    /// <summary>ApartmentId = null → إصدار جماعي لكل شقق العمارة.</summary>
    [HttpPost]
    [HasPermission("Invoices.Create")]
    public Task<IReadOnlyList<InvoiceDto>> Create(CreateInvoiceRequest request, CancellationToken ct)
        => invoices.CreateAsync(request, ct);

    /// <summary>تسجيل دفعة (كاملة أو جزئية) — المالك يدفع فواتيره والأدمن يسجل لأي شقة.</summary>
    [HttpPost("{id:int}/payments")]
    [HasPermission("Invoices.Pay")]
    public Task<InvoiceDto> AddPayment(int id, AddPaymentRequest request, CancellationToken ct)
        => invoices.AddPaymentAsync(id, request, ct);

    [HttpGet("{id:int}/payments")]
    [HasPermission("Invoices.View")]
    public Task<IReadOnlyList<PaymentDto>> Payments(int id, CancellationToken ct)
        => invoices.GetPaymentsAsync(id, ct);

    /// <summary>إشعار تذكير لكل الساكنين اللي عندهم مستحقات.</summary>
    [HttpPost("reminders")]
    [HasPermission("Invoices.SendReminders")]
    public Task<SendRemindersResult> SendReminders(CancellationToken ct)
        => invoices.SendRemindersAsync(ct);

    /// <summary>بدء دفعة أونلاين حقيقية (بطاقة/فوري عبر Paymob) — بيرجع رابط صفحة الدفع.</summary>
    [HttpPost("{id:int}/checkout")]
    [HasPermission("Invoices.Pay")]
    public Task<CheckoutResponseDto> CreateCheckout(int id, CreateCheckoutRequest request, CancellationToken ct)
        => invoices.CreateCheckoutAsync(id, request, ct);
}
