using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using IttihadAlMullak.Api.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/settings")]
[HasPermission("Settings.View")]
public class SettingsController(ISettingsService settings) : ControllerBase
{
    [HttpGet]
    public Task<BuildingSettingsDto> Get(CancellationToken ct)
        => settings.GetAsync(ct);

    [HttpPut]
    public Task<BuildingSettingsDto> Update(UpdateBuildingSettingsRequest request, CancellationToken ct)
        => settings.UpdateAsync(request, ct);
}
