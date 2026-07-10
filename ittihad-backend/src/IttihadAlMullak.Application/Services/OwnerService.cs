using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class OwnerService(IApplicationDbContext db, ICurrentUser currentUser) : IOwnerService
{
    public async Task<OwnerSummaryDto> GetSummaryAsync(CancellationToken ct = default)
    {
        var user = await db.Users
            .Include(u => u.Building)
            .FirstOrDefaultAsync(u => u.Id == currentUser.UserId, ct)
            ?? throw new NotFoundException("المستخدم غير موجود");

        var apartment = await db.Apartments
            .FirstOrDefaultAsync(a => a.OwnerId == user.Id || a.TenantId == user.Id, ct);

        var bills = await MyBillsQuery().ToListAsync(ct);
        var pending = bills.Where(i => i.Status != InvoiceStatus.Paid).ToList();
        var dueAmount = pending.Sum(i => i.Amount - i.PaidAmount);

        var lastPayment = await db.Payments
            .Where(p => p.PaidById == user.Id)
            .OrderByDescending(p => p.PaidAt)
            .Select(p => (DateTime?)p.PaidAt)
            .FirstOrDefaultAsync(ct);

        var activeMaintenance = await db.MaintenanceRequests
            .CountAsync(m => m.RequesterId == user.Id
                && m.Status != MaintenanceStatus.Completed
                && m.Status != MaintenanceStatus.Rejected, ct);

        var announcements = await db.Announcements
            .Include(a => a.CreatedBy)
            .Where(a => a.BuildingId == currentUser.BuildingId)
            .OrderByDescending(a => a.CreatedAt)
            .Take(3)
            .ToListAsync(ct);

        var newAnnouncements = await db.Announcements
            .CountAsync(a => a.BuildingId == currentUser.BuildingId && a.CreatedAt >= DateTime.UtcNow.AddDays(-7), ct);

        return new OwnerSummaryDto(
            user.Name,
            apartment?.Number,
            apartment?.Floor,
            user.Building?.Name ?? string.Empty,
            user.Building?.Address ?? string.Empty,
            Math.Max(dueAmount, 0),
            lastPayment,
            activeMaintenance,
            newAnnouncements,
            pending.Select(i => i.ToDto()).ToList(),
            announcements.Select(a => a.ToDto()).ToList());
    }

    public async Task<IReadOnlyList<InvoiceDto>> MyBillsAsync(CancellationToken ct = default)
    {
        var bills = await MyBillsQuery()
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(ct);
        return bills.Select(i => i.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<MaintenanceDto>> MyMaintenanceAsync(CancellationToken ct = default)
    {
        var requests = await db.MaintenanceRequests
            .Include(m => m.Apartment)
            .Include(m => m.Requester)
            .Where(m => m.RequesterId == currentUser.UserId)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync(ct);
        return requests.Select(r => r.ToDto()).ToList();
    }

    private IQueryable<Domain.Entities.Invoice> MyBillsQuery() => db.Invoices
        .Include(i => i.Payments)
        .Include(i => i.Apartment).ThenInclude(a => a.Owner)
        .Where(i => i.Apartment.OwnerId == currentUser.UserId || i.Apartment.TenantId == currentUser.UserId);
}
