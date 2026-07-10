using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace IttihadAlMullak.Application.Services;

public class PermissionService(IApplicationDbContext db, IMemoryCache cache) : IPermissionService
{
    private const string CachePrefix = "permissions_role_";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);

    public async Task<bool> HasPermissionAsync(UserRole role, string permissionKey, CancellationToken ct = default)
    {
        var keys = await GetKeysForRoleAsync(role, ct);
        return keys.Contains(permissionKey, StringComparer.OrdinalIgnoreCase);
    }

    public async Task<IReadOnlyList<string>> GetKeysForRoleAsync(UserRole role, CancellationToken ct = default)
    {
        return (await cache.GetOrCreateAsync($"{CachePrefix}{role}", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;
            return (IReadOnlyList<string>)await db.RolePermissions
                .Where(p => p.Role == role)
                .Select(p => p.Screen.Key + "." + p.Action.Key)
                .ToListAsync(ct);
        }))!;
    }

    public async Task<PermissionMatrixDto> GetMatrixAsync(CancellationToken ct = default)
    {
        var screens = await db.Screens
            .OrderBy(s => s.SortOrder)
            .Select(s => new ScreenDto(s.Id, s.Key, s.NameAr, s.NameEn, s.SortOrder))
            .ToListAsync(ct);

        var actions = await db.PermissionActions
            .OrderBy(a => a.Id)
            .Select(a => new PermissionActionDto(a.Id, a.Key, a.NameAr, a.NameEn))
            .ToListAsync(ct);

        var granted = await db.RolePermissions
            .Select(p => new { p.Role, p.ScreenId, p.ActionId })
            .ToListAsync(ct);
        var grantedSet = granted.Select(g => (g.Role, g.ScreenId, g.ActionId)).ToHashSet();

        var cells = new List<PermissionMatrixCellDto>();
        foreach (var screen in screens)
        {
            foreach (var action in actions)
            {
                cells.Add(new PermissionMatrixCellDto(
                    screen.Id,
                    action.Id,
                    grantedSet.Contains((UserRole.Admin, screen.Id, action.Id)),
                    grantedSet.Contains((UserRole.Owner, screen.Id, action.Id)),
                    grantedSet.Contains((UserRole.Tenant, screen.Id, action.Id))));
            }
        }

        return new PermissionMatrixDto(screens, actions, cells);
    }

    public async Task UpdateAsync(UpdatePermissionRequest request, CancellationToken ct = default)
    {
        var existing = await db.RolePermissions.FirstOrDefaultAsync(
            p => p.Role == request.Role && p.ScreenId == request.ScreenId && p.ActionId == request.ActionId, ct);

        if (request.Granted && existing is null)
        {
            db.RolePermissions.Add(new RolePermission
            {
                Role = request.Role,
                ScreenId = request.ScreenId,
                ActionId = request.ActionId,
            });
            await db.SaveChangesAsync(ct);
        }
        else if (!request.Granted && existing is not null)
        {
            db.RolePermissions.Remove(existing);
            await db.SaveChangesAsync(ct);
        }

        cache.Remove($"{CachePrefix}{request.Role}"); // إبطال الكاش فوراً بعد التعديل
    }
}
