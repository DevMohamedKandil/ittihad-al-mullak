using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

/// <summary>واجهات تطبيق المالك/المستأجر (الموبايل).</summary>
[ApiController]
[Route("api/v1/owner")]
[Authorize]
public class OwnerController(IOwnerService owner) : ControllerBase
{
    /// <summary>ملخص الرئيسية: المستحق، آخر دفعة، طلباتي النشطة، آخر الإعلانات.</summary>
    [HttpGet("summary")]
    public Task<OwnerSummaryDto> Summary(CancellationToken ct)
        => owner.GetSummaryAsync(ct);

    [HttpGet("bills")]
    public Task<IReadOnlyList<InvoiceDto>> Bills(CancellationToken ct)
        => owner.MyBillsAsync(ct);

    [HttpGet("maintenance")]
    public Task<IReadOnlyList<MaintenanceDto>> Maintenance(CancellationToken ct)
        => owner.MyMaintenanceAsync(ct);
}
