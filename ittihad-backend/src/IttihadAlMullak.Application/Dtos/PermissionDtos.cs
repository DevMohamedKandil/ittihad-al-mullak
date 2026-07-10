using IttihadAlMullak.Domain;

namespace IttihadAlMullak.Application.Dtos;

public record ScreenDto(int Id, string Key, string NameAr, string NameEn, int SortOrder);

public record PermissionActionDto(int Id, string Key, string NameAr, string NameEn);

/// <summary>صف في مصفوفة الصلاحيات: شاشة × أكشن × ممنوح لكل دور.</summary>
public record PermissionMatrixCellDto(int ScreenId, int ActionId, bool Admin, bool Owner, bool Tenant);

public record PermissionMatrixDto(
    IReadOnlyList<ScreenDto> Screens,
    IReadOnlyList<PermissionActionDto> Actions,
    IReadOnlyList<PermissionMatrixCellDto> Cells);

public record UpdatePermissionRequest(UserRole Role, int ScreenId, int ActionId, bool Granted);
