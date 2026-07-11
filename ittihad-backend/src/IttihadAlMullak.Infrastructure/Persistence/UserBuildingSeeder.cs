using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Infrastructure.Persistence;

/// <summary>
/// بيربط كل مستخدم قديم عنده BuildingId بعضوية UserBuilding مطابقة —
/// منفصل عن DbSeeder عشان يشتغل حتى على قواعد بيانات كانت موجودة قبل نظام تعدد العمارات.
/// بيتنفذ في كل تشغيل (مش مرة واحدة بس) عشان يغطي أي مستخدم قديم لسه من غير عضوية.
/// </summary>
public static class UserBuildingSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        var missing = await db.Users
            .Where(u => u.BuildingId != null && !db.UserBuildings.Any(ub => ub.UserId == u.Id && ub.BuildingId == u.BuildingId))
            .Select(u => new { u.Id, BuildingId = u.BuildingId!.Value })
            .ToListAsync();

        if (missing.Count == 0) return;

        db.UserBuildings.AddRange(missing.Select(u => new UserBuilding { UserId = u.Id, BuildingId = u.BuildingId }));
        await db.SaveChangesAsync();
    }
}
