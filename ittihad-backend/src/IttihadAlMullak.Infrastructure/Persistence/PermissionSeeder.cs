using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Infrastructure.Persistence;

/// <summary>
/// Seed للشاشات والأكشنز والصلاحيات الافتراضية.
/// منفصل عن DbSeeder عشان يشتغل حتى على قواعد بيانات قديمة متعملة قبل نظام الصلاحيات.
/// </summary>
public static class PermissionSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Screens.AnyAsync()) return;

        Screen NewScreen(string key, string ar, string en, int order) =>
            new() { Key = key, NameAr = ar, NameEn = en, SortOrder = order };

        var screens = new[]
        {
            NewScreen("Dashboard", "لوحة التحكم", "Dashboard", 1),
            NewScreen("Apartments", "الشقق", "Apartments", 2),
            NewScreen("Invoices", "الفواتير", "Invoices", 3),
            NewScreen("Expenses", "المصروفات", "Expenses", 4),
            NewScreen("Maintenance", "طلبات الصيانة", "Maintenance", 5),
            NewScreen("Announcements", "الإعلانات", "Announcements", 6),
            NewScreen("Users", "المستخدمين", "Users", 7),
            NewScreen("Settings", "الإعدادات", "Settings", 8),
            NewScreen("Messages", "المحادثات", "Messages", 9),
            NewScreen("Permissions", "الصلاحيات", "Permissions", 10),
        };
        db.Screens.AddRange(screens);

        PermissionAction NewAction(string key, string ar, string en) =>
            new() { Key = key, NameAr = ar, NameEn = en };

        var actions = new[]
        {
            NewAction("View", "عرض", "View"),
            NewAction("Create", "إضافة", "Create"),
            NewAction("Edit", "تعديل", "Edit"),
            NewAction("Delete", "حذف", "Delete"),
            NewAction("Pay", "دفع", "Pay"),
            NewAction("Export", "تصدير", "Export"),
            NewAction("ChangeStatus", "تغيير الحالة", "Change status"),
            NewAction("SendReminders", "إرسال تذكيرات", "Send reminders"),
        };
        db.PermissionActions.AddRange(actions);
        await db.SaveChangesAsync();

        var screenByKey = screens.ToDictionary(s => s.Key);
        var actionByKey = actions.ToDictionary(a => a.Key);

        void Grant(UserRole role, string screenKey, params string[] actionKeys)
        {
            foreach (var actionKey in actionKeys)
            {
                db.RolePermissions.Add(new RolePermission
                {
                    Role = role,
                    ScreenId = screenByKey[screenKey].Id,
                    ActionId = actionByKey[actionKey].Id,
                });
            }
        }

        // الأدمن (لجنة الإدارة): كل حاجة
        foreach (var screen in screens)
            Grant(UserRole.Admin, screen.Key, [.. actions.Select(a => a.Key)]);

        // المالك: فواتيره (عرض + دفع)، صيانة (عرض + إضافة)، إعلانات، محادثات
        Grant(UserRole.Owner, "Invoices", "View", "Pay");
        Grant(UserRole.Owner, "Maintenance", "View", "Create");
        Grant(UserRole.Owner, "Announcements", "View");
        Grant(UserRole.Owner, "Messages", "View", "Create");

        // المستأجر: نفس المالك من غير الدفع
        Grant(UserRole.Tenant, "Invoices", "View");
        Grant(UserRole.Tenant, "Maintenance", "View", "Create");
        Grant(UserRole.Tenant, "Announcements", "View");
        Grant(UserRole.Tenant, "Messages", "View", "Create");

        await db.SaveChangesAsync();
    }
}
