using System.ComponentModel.DataAnnotations;

namespace IttihadAlMullak.Application.Dtos;

public record ApartmentDto(
    int Id,
    string Number,
    int Floor,
    int? OwnerId,
    string? OwnerName,
    string? OwnerPhone,
    int? TenantId,
    string? TenantName,
    string ResidentType,      // "owner" | "tenant" — نوع الساكن الفعلي
    string PaymentStatus,     // "paid" | "partial" | "unpaid" | "overdue"
    decimal DueAmount);

public record CreateApartmentRequest(
    [Required] string Number,
    int Floor,
    int? OwnerId,
    int? TenantId);

public record UpdateApartmentRequest(string? Number, int? Floor, int? OwnerId, int? TenantId);

public record BuildingSettingsDto(
    int Id,
    string Code,
    string Name,
    string Address,
    int FloorsCount,
    int ApartmentsCount,
    decimal MonthlySubscription,
    int DueDay,
    string? Phone,
    string? WhatsApp,
    string? Email);

public record UpdateBuildingSettingsRequest(
    [Required] string Name,
    [Required] string Address,
    int FloorsCount,
    int ApartmentsCount,
    decimal MonthlySubscription,
    int DueDay,
    string? Phone,
    string? WhatsApp,
    string? Email);
