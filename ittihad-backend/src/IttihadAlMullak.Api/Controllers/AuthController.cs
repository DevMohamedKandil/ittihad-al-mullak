using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController(IAuthService auth) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public Task<AuthResponse> Login(LoginRequest request, CancellationToken ct)
        => auth.LoginAsync(request, ct);

    [HttpPost("refresh")]
    [AllowAnonymous]
    public Task<AuthResponse> Refresh(RefreshRequest request, CancellationToken ct)
        => auth.RefreshAsync(request, ct);

    [HttpGet("me")]
    [Authorize]
    public Task<UserDto> Me(CancellationToken ct) => auth.MeAsync(ct);

    /// <summary>مفاتيح صلاحيات المستخدم الحالي — الفرونت بيستخدمها لإخفاء الأزرار.</summary>
    [HttpGet("my-permissions")]
    [Authorize]
    public Task<IReadOnlyList<string>> MyPermissions(
        [FromServices] IttihadAlMullak.Application.Interfaces.IPermissionService permissions,
        [FromServices] IttihadAlMullak.Application.Interfaces.ICurrentUser currentUser,
        CancellationToken ct)
        => permissions.GetKeysForRoleAsync(currentUser.Role, ct);

    [HttpPost("change-password")]
    [Authorize]
    public Task ChangePassword(ChangePasswordRequest request, CancellationToken ct)
        => auth.ChangePasswordAsync(request, ct);

    [HttpPost("devices")]
    [Authorize]
    public Task RegisterDevice(RegisterDeviceRequest request, CancellationToken ct)
        => auth.RegisterDeviceAsync(request, ct);

    /// <summary>العمارات اللي المستخدم الحالي عضو فيها — لعرض مبدّل العمارة في الواجهة.</summary>
    [HttpGet("my-buildings")]
    [Authorize]
    public Task<IReadOnlyList<BuildingSummaryDto>> MyBuildings(CancellationToken ct)
        => auth.MyBuildingsAsync(ct);

    [HttpPost("switch-building")]
    [Authorize]
    public Task<AuthResponse> SwitchBuilding(SwitchBuildingRequest request, CancellationToken ct)
        => auth.SwitchBuildingAsync(request, ct);

    [HttpPost("buildings")]
    [Authorize]
    public Task<AuthResponse> CreateBuilding(CreateBuildingRequest request, CancellationToken ct)
        => auth.CreateBuildingAsync(request, ct);
}
