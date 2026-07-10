using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/settings")]
[Authorize(Roles = "Admin")]
public class SettingsController(ISettingsService settings) : ControllerBase
{
    [HttpGet]
    public Task<BuildingSettingsDto> Get(CancellationToken ct)
        => settings.GetAsync(ct);

    [HttpPut]
    public Task<BuildingSettingsDto> Update(UpdateBuildingSettingsRequest request, CancellationToken ct)
        => settings.UpdateAsync(request, ct);
}
