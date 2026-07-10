using System.Security.Claims;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;

namespace IttihadAlMullak.Api.Services;

/// <summary>قراءة هوية المستخدم الحالي من الـ JWT claims (تنفيذ ICurrentUser للـ Application).</summary>
public class CurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    private ClaimsPrincipal Principal =>
        httpContextAccessor.HttpContext?.User ?? new ClaimsPrincipal();

    public int UserId =>
        int.TryParse(Principal.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : 0;

    public UserRole Role =>
        Enum.TryParse<UserRole>(Principal.FindFirstValue(ClaimTypes.Role), out var role) ? role : UserRole.Tenant;

    public int BuildingId =>
        int.TryParse(Principal.FindFirstValue("buildingId"), out var id) ? id : 0;

    public bool IsAdmin => Role == UserRole.Admin;
}
