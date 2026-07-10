using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using Microsoft.AspNetCore.Authorization;
using IttihadAlMullak.Api.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/maintenance")]
[Authorize]
public class MaintenanceController(IMaintenanceService maintenance) : ControllerBase
{
    /// <summary>الأدمن يشوف كل الطلبات، والساكن يشوف طلباته فقط.</summary>
    [HttpGet]
    public Task<IReadOnlyList<MaintenanceDto>> List([FromQuery] MaintenanceStatus? status, CancellationToken ct)
        => maintenance.ListAsync(status, ct);

    [HttpGet("{id:int}")]
    public Task<MaintenanceDto> Get(int id, CancellationToken ct)
        => maintenance.GetAsync(id, ct);

    [HttpPost]
    public Task<MaintenanceDto> Create(CreateMaintenanceRequest request, CancellationToken ct)
        => maintenance.CreateAsync(request, ct);

    [HttpPatch("{id:int}/status")]
    [HasPermission("Maintenance.ChangeStatus")]
    public Task<MaintenanceDto> UpdateStatus(int id, UpdateMaintenanceStatusRequest request, CancellationToken ct)
        => maintenance.UpdateStatusAsync(id, request, ct);

    /// <summary>رفع صورة للطلب (jpg/png/webp حتى 5MB، بحد أقصى ٥ صور).</summary>
    [HttpPost("{id:int}/photos")]
    public async Task<MaintenanceDto> AddPhoto(int id, IFormFile file, CancellationToken ct)
    {
        await using var stream = file.OpenReadStream();
        return await maintenance.AddPhotoAsync(id, stream, file.FileName, ct);
    }
}
