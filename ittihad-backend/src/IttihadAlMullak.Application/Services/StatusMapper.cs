using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;

namespace IttihadAlMullak.Application.Services;

/// <summary>تحويلات مشتركة بين الكيانات والـ DTOs.</summary>
public static class StatusMapper
{
    public static string ToStatusString(this Invoice invoice) => invoice switch
    {
        { Status: InvoiceStatus.Paid } => "paid",
        { IsOverdue: true } => "overdue",
        { Status: InvoiceStatus.Partial } => "partial",
        _ => "unpaid",
    };

    public static InvoiceDto ToDto(this Invoice i) => new(
        i.Id,
        i.Number,
        i.ApartmentId,
        i.Apartment?.Number ?? string.Empty,
        i.Apartment?.Owner?.Name,
        i.Title,
        i.Period,
        i.Amount,
        i.PaidAmount,
        i.DueDate,
        i.Type,
        i.ToStatusString(),
        i.CreatedAt);

    public static MaintenanceDto ToDto(this MaintenanceRequest r) => new(
        r.Id,
        r.Title,
        r.Description,
        r.Category,
        r.Apartment?.Number ?? "عام",
        r.RequesterId,
        r.Requester?.Name ?? string.Empty,
        r.Status,
        r.Priority,
        r.AssignedTo,
        r.RejectionReason,
        r.Photos,
        r.CreatedAt,
        r.ResolvedAt);

    public static AnnouncementDto ToDto(this Announcement a) => new(
        a.Id,
        a.Title,
        a.Content,
        a.Type,
        a.IsPinned,
        a.CreatedBy?.Name ?? string.Empty,
        a.ScheduledAt,
        a.CreatedAt);
}
