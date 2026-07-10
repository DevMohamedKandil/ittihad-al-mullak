using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/invoices")]
[Authorize]
public class InvoicesController(IInvoiceService invoices) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public Task<PagedResult<InvoiceDto>> List(
        [FromQuery] string? status,
        [FromQuery] string? period,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
        => invoices.ListAsync(status, period, search, page, pageSize, ct);

    [HttpGet("summary")]
    [Authorize(Roles = "Admin")]
    public Task<InvoicesSummaryDto> Summary(CancellationToken ct)
        => invoices.GetSummaryAsync(ct);

    /// <summary>ApartmentId = null → إصدار جماعي لكل شقق العمارة.</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public Task<IReadOnlyList<InvoiceDto>> Create(CreateInvoiceRequest request, CancellationToken ct)
        => invoices.CreateAsync(request, ct);

    /// <summary>تسجيل دفعة (كاملة أو جزئية) — المالك يدفع فواتيره والأدمن يسجل لأي شقة.</summary>
    [HttpPost("{id:int}/payments")]
    public Task<InvoiceDto> AddPayment(int id, AddPaymentRequest request, CancellationToken ct)
        => invoices.AddPaymentAsync(id, request, ct);

    [HttpGet("{id:int}/payments")]
    public Task<IReadOnlyList<PaymentDto>> Payments(int id, CancellationToken ct)
        => invoices.GetPaymentsAsync(id, ct);

    /// <summary>إشعار تذكير لكل الساكنين اللي عندهم مستحقات.</summary>
    [HttpPost("reminders")]
    [Authorize(Roles = "Admin")]
    public Task<SendRemindersResult> SendReminders(CancellationToken ct)
        => invoices.SendRemindersAsync(ct);
}
