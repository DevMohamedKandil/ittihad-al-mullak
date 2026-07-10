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

    [HttpPost("change-password")]
    [Authorize]
    public Task ChangePassword(ChangePasswordRequest request, CancellationToken ct)
        => auth.ChangePasswordAsync(request, ct);

    [HttpPost("devices")]
    [Authorize]
    public Task RegisterDevice(RegisterDeviceRequest request, CancellationToken ct)
        => auth.RegisterDeviceAsync(request, ct);
}
