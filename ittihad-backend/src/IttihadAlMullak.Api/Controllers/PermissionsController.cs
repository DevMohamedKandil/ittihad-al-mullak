using IttihadAlMullak.Api.Authorization;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/permissions")]
public class PermissionsController(IPermissionService permissions) : ControllerBase
{
    /// <summary>مصفوفة الصلاحيات كاملة (شاشات × أكشنز × أدوار) — لشاشة إدارة الصلاحيات.</summary>
    [HttpGet("matrix")]
    [HasPermission("Permissions.View")]
    public Task<PermissionMatrixDto> Matrix(CancellationToken ct)
        => permissions.GetMatrixAsync(ct);

    /// <summary>منح/سحب صلاحية لدور.</summary>
    [HttpPut]
    [HasPermission("Permissions.Edit")]
    public Task Update(UpdatePermissionRequest request, CancellationToken ct)
        => permissions.UpdateAsync(request, ct);
}
