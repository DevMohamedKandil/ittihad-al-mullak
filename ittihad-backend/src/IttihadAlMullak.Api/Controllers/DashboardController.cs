using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/dashboard")]
[Authorize(Roles = "Admin")]
public class DashboardController(IDashboardService dashboard) : ControllerBase
{
    [HttpGet("stats")]
    public Task<DashboardStatsDto> Stats(CancellationToken ct)
        => dashboard.GetStatsAsync(ct);

    [HttpGet("collection-chart")]
    public Task<CollectionChartDto> CollectionChart(CancellationToken ct)
        => dashboard.GetCollectionChartAsync(ct);
}
