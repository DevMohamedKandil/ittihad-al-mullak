using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class SettingsService(IApplicationDbContext db, ICurrentUser currentUser) : ISettingsService
{
    public async Task<BuildingSettingsDto> GetAsync(CancellationToken ct = default)
    {
        var building = await db.Buildings.FirstOrDefaultAsync(b => b.Id == currentUser.BuildingId, ct)
            ?? throw new NotFoundException(Msg.Get("BuildingNotFound"));
        return new BuildingSettingsDto(
            building.Id, building.Code, building.Name, building.Address,
            building.FloorsCount, building.ApartmentsCount, building.MonthlySubscription,
            building.DueDay, building.Phone, building.WhatsApp, building.Email);
    }

    public async Task<BuildingSettingsDto> UpdateAsync(UpdateBuildingSettingsRequest request, CancellationToken ct = default)
    {
        var building = await db.Buildings.FirstOrDefaultAsync(b => b.Id == currentUser.BuildingId, ct)
            ?? throw new NotFoundException(Msg.Get("BuildingNotFound"));

        building.Name = request.Name;
        building.Address = request.Address;
        building.FloorsCount = request.FloorsCount;
        building.ApartmentsCount = request.ApartmentsCount;
        building.MonthlySubscription = request.MonthlySubscription;
        building.DueDay = request.DueDay;
        building.Phone = request.Phone;
        building.WhatsApp = request.WhatsApp;
        building.Email = request.Email;
        await db.SaveChangesAsync(ct);

        return await GetAsync(ct);
    }
}
