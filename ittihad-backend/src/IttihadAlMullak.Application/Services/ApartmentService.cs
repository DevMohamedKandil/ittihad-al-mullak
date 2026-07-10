using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class ApartmentService(IApplicationDbContext db, ICurrentUser currentUser) : IApartmentService
{
    public async Task<IReadOnlyList<ApartmentDto>> ListAsync(string? search, CancellationToken ct = default)
    {
        var query = db.Apartments
            .Include(a => a.Owner)
            .Include(a => a.Tenant)
            .Include(a => a.Invoices).ThenInclude(i => i.Payments)
            .Where(a => a.BuildingId == currentUser.BuildingId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(a =>
                a.Number.Contains(term) ||
                (a.Owner != null && (a.Owner.Name.Contains(term) || a.Owner.Phone.Contains(term))) ||
                (a.Tenant != null && (a.Tenant.Name.Contains(term) || a.Tenant.Phone.Contains(term))));
        }

        var apartments = await query.OrderBy(a => a.Floor).ThenBy(a => a.Number).ToListAsync(ct);
        return apartments.Select(ToDto).ToList();
    }

    public async Task<ApartmentDto> GetAsync(int id, CancellationToken ct = default)
        => ToDto(await FindAsync(id, ct));

    public async Task<ApartmentDto> CreateAsync(CreateApartmentRequest request, CancellationToken ct = default)
    {
        var duplicate = await db.Apartments
            .AnyAsync(a => a.BuildingId == currentUser.BuildingId && a.Number == request.Number, ct);
        if (duplicate)
            throw new BusinessRuleException(Msg.Format("ApartmentExists", request.Number));

        var apartment = new Apartment
        {
            BuildingId = currentUser.BuildingId,
            Number = request.Number,
            Floor = request.Floor,
            OwnerId = request.OwnerId,
            TenantId = request.TenantId,
        };
        db.Apartments.Add(apartment);
        await db.SaveChangesAsync(ct);
        return ToDto(await FindAsync(apartment.Id, ct));
    }

    public async Task<ApartmentDto> UpdateAsync(int id, UpdateApartmentRequest request, CancellationToken ct = default)
    {
        var apartment = await FindAsync(id, ct);
        if (request.Number is not null) apartment.Number = request.Number;
        if (request.Floor is not null) apartment.Floor = request.Floor.Value;
        apartment.OwnerId = request.OwnerId ?? apartment.OwnerId;
        apartment.TenantId = request.TenantId ?? apartment.TenantId;
        await db.SaveChangesAsync(ct);
        return ToDto(await FindAsync(id, ct));
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var apartment = await FindAsync(id, ct);
        db.Apartments.Remove(apartment);
        await db.SaveChangesAsync(ct);
    }

    private async Task<Apartment> FindAsync(int id, CancellationToken ct)
        => await db.Apartments
            .Include(a => a.Owner)
            .Include(a => a.Tenant)
            .Include(a => a.Invoices).ThenInclude(i => i.Payments)
            .FirstOrDefaultAsync(a => a.Id == id && a.BuildingId == currentUser.BuildingId, ct)
        ?? throw new NotFoundException(Msg.Get("ApartmentNotFound"));

    private static ApartmentDto ToDto(Apartment a)
    {
        var due = a.Invoices
            .Where(i => i.Status != InvoiceStatus.Paid)
            .Sum(i => i.Amount - i.PaidAmount);

        var status = a.Invoices.Count == 0 ? "paid"
            : a.Invoices.Any(i => i.IsOverdue) ? "overdue"
            : a.Invoices.All(i => i.Status == InvoiceStatus.Paid) ? "paid"
            : a.Invoices.Any(i => i.Status == InvoiceStatus.Partial || i.Status == InvoiceStatus.Paid) ? "partial"
            : "unpaid";

        return new ApartmentDto(
            a.Id,
            a.Number,
            a.Floor,
            a.OwnerId,
            a.Owner?.Name,
            a.Owner?.Phone,
            a.TenantId,
            a.Tenant?.Name,
            a.TenantId is not null ? "tenant" : "owner",
            status,
            Math.Max(due, 0));
    }
}
