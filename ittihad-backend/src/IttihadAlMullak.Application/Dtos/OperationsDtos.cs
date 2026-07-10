using System.ComponentModel.DataAnnotations;
using IttihadAlMullak.Domain;

namespace IttihadAlMullak.Application.Dtos;

public record MaintenanceDto(
    int Id,
    string Title,
    string Description,
    string? Category,
    string ApartmentLabel, // رقم الشقة أو "عام"
    int RequesterId,
    string RequesterName,
    MaintenanceStatus Status,
    MaintenancePriority Priority,
    string? AssignedTo,
    string? RejectionReason,
    IReadOnlyList<string> Photos,
    DateTime CreatedAt,
    DateTime? ResolvedAt);

public record CreateMaintenanceRequest(
    [Required] string Title,
    [Required] string Description,
    string? Category,
    MaintenancePriority Priority,
    int? ApartmentId);

public record UpdateMaintenanceStatusRequest(
    MaintenanceStatus Status,
    string? AssignedTo,
    string? RejectionReason);

public record AnnouncementDto(
    int Id,
    string Title,
    string Content,
    AnnouncementType Type,
    bool IsPinned,
    string CreatedByName,
    DateTime? ScheduledAt,
    DateTime CreatedAt);

public record CreateAnnouncementRequest(
    [Required] string Title,
    [Required] string Content,
    AnnouncementType Type,
    bool IsPinned,
    DateTime? ScheduledAt);

public record NotificationDto(int Id, string Title, string Body, bool IsRead, DateTime CreatedAt);

public record CreateUserRequest(
    [Required] string Name,
    [Required] string Phone,
    string? Email,
    [Required, MinLength(6)] string Password,
    UserRole Role,
    int? ApartmentId);

public record UpdateUserRequest(string? Name, string? Email, bool? IsActive);

public record UserListDto(
    int Id,
    string Name,
    string Phone,
    string? Email,
    UserRole Role,
    bool IsActive,
    string? ApartmentNumber,
    DateTime CreatedAt);
