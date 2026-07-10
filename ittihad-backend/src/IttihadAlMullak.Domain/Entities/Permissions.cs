namespace IttihadAlMullak.Domain.Entities;

/// <summary>شاشة من شاشات النظام (زي جدول Screen في Afzaz).</summary>
public class Screen
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty; // "Invoices"
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public int SortOrder { get; set; }

    public ICollection<RolePermission> RolePermissions { get; set; } = [];
}

/// <summary>أكشن ممكن يتعمل على شاشة (عرض/إضافة/تعديل/حذف/دفع...) — زي Permission.ActionName في Afzaz.</summary>
public class PermissionAction
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty; // "Create"
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
}

/// <summary>
/// منح صلاحية (شاشة + أكشن) لدور — زي PermissionRole في Afzaz.
/// وجود الصف = الدور معاه الصلاحية. مفتاح الصلاحية النصي: "{Screen.Key}.{Action.Key}"
/// </summary>
public class RolePermission
{
    public int Id { get; set; }
    public UserRole Role { get; set; }
    public int ScreenId { get; set; }
    public Screen Screen { get; set; } = null!;
    public int ActionId { get; set; }
    public PermissionAction Action { get; set; } = null!;
}
