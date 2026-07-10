using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class DashboardService(IApplicationDbContext db, ICurrentUser currentUser) : IDashboardService
{
    private static readonly string[] ArabicMonths =
        ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default)
    {
        var buildingId = currentUser.BuildingId;
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1);

        var invoices = await db.Invoices
            .Include(i => i.Payments)
            .Where(i => i.BuildingId == buildingId)
            .ToListAsync(ct);

        var totalAmount = invoices.Sum(i => i.Amount);
        var collected = invoices.Sum(i => Math.Min(i.PaidAmount, i.Amount));
        var collectionRate = totalAmount > 0 ? (int)Math.Round(collected / totalAmount * 100) : 0;

        var totalExpenses = await db.Expenses
            .Where(e => e.BuildingId == buildingId && e.Date >= monthStart)
            .SumAsync(e => e.Amount, ct);

        var openMaintenance = await db.MaintenanceRequests
            .CountAsync(m => m.BuildingId == buildingId && m.Status != MaintenanceStatus.Completed && m.Status != MaintenanceStatus.Rejected, ct);

        var newMaintenance = await db.MaintenanceRequests
            .CountAsync(m => m.BuildingId == buildingId && m.CreatedAt >= now.AddDays(-7), ct);

        var residents = await db.Users
            .CountAsync(u => u.BuildingId == buildingId && u.Role != UserRole.Admin && u.IsActive, ct);

        var apartments = await db.Apartments.CountAsync(a => a.BuildingId == buildingId, ct);

        return new DashboardStatsDto(collectionRate, totalExpenses, openMaintenance, newMaintenance, residents, apartments);
    }

    public async Task<CollectionChartDto> GetCollectionChartAsync(CancellationToken ct = default)
    {
        var buildingId = currentUser.BuildingId;
        var now = DateTime.UtcNow;

        var invoices = await db.Invoices
            .Include(i => i.Payments)
            .Where(i => i.BuildingId == buildingId)
            .ToListAsync(ct);

        // آخر ٦ شهور: المحصّل فعلياً مقابل المستهدف (إجمالي فواتير الشهر)
        var monthly = new List<MonthlyCollectionDto>();
        for (var offset = 5; offset >= 0; offset--)
        {
            var month = new DateTime(now.Year, now.Month, 1).AddMonths(-offset);
            var monthInvoices = invoices
                .Where(i => i.DueDate.Year == month.Year && i.DueDate.Month == month.Month)
                .ToList();
            var target = monthInvoices.Sum(i => i.Amount);
            var collected = monthInvoices.Sum(i => Math.Min(i.PaidAmount, i.Amount));
            monthly.Add(new MonthlyCollectionDto(ArabicMonths[month.Month - 1], collected, target));
        }

        // توزيع الشقق حسب حالة السداد (على مستوى الشقة مش الفاتورة)
        var byApartment = invoices.GroupBy(i => i.ApartmentId).ToList();
        var paid = byApartment.Count(g => g.All(i => i.Status == InvoiceStatus.Paid));
        var unpaid = byApartment.Count(g => g.All(i => i.Status == InvoiceStatus.Unpaid));
        var partial = byApartment.Count - paid - unpaid;

        return new CollectionChartDto(monthly, new PaymentStatusBreakdownDto(paid, partial, unpaid));
    }
}
