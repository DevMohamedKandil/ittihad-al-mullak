using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class AnnouncementService(
    IApplicationDbContext db,
    ICurrentUser currentUser,
    INotificationService notifications) : IAnnouncementService
{
    public async Task<IReadOnlyList<AnnouncementDto>> ListAsync(CancellationToken ct = default)
    {
        var announcements = await db.Announcements
            .Include(a => a.CreatedBy)
            .Where(a => a.BuildingId == currentUser.BuildingId)
            .OrderByDescending(a => a.IsPinned)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync(ct);
        return announcements.Select(a => a.ToDto()).ToList();
    }

    public async Task<AnnouncementDto> CreateAsync(CreateAnnouncementRequest request, CancellationToken ct = default)
    {
        var announcement = new Announcement
        {
            BuildingId = currentUser.BuildingId,
            Title = request.Title,
            Content = request.Content,
            Type = request.Type,
            IsPinned = request.IsPinned,
            ScheduledAt = request.ScheduledAt,
            CreatedById = currentUser.UserId,
        };
        db.Announcements.Add(announcement);
        await db.SaveChangesAsync(ct);

        // إشعار داخلي لكل سكان العمارة
        var residents = await db.Users
            .Where(u => u.BuildingId == currentUser.BuildingId && u.Role != UserRole.Admin && u.IsActive)
            .Select(u => u.Id)
            .ToListAsync(ct);
        foreach (var userId in residents)
            await notifications.NotifyAsync(userId, $"إعلان جديد: {request.Title}", request.Content, ct);

        return (await FindAsync(announcement.Id, ct)).ToDto();
    }

    public async Task<AnnouncementDto> UpdateAsync(int id, CreateAnnouncementRequest request, CancellationToken ct = default)
    {
        var announcement = await FindAsync(id, ct);
        announcement.Title = request.Title;
        announcement.Content = request.Content;
        announcement.Type = request.Type;
        announcement.IsPinned = request.IsPinned;
        announcement.ScheduledAt = request.ScheduledAt;
        await db.SaveChangesAsync(ct);
        return announcement.ToDto();
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        db.Announcements.Remove(await FindAsync(id, ct));
        await db.SaveChangesAsync(ct);
    }

    private async Task<Announcement> FindAsync(int id, CancellationToken ct)
        => await db.Announcements
            .Include(a => a.CreatedBy)
            .FirstOrDefaultAsync(a => a.Id == id && a.BuildingId == currentUser.BuildingId, ct)
        ?? throw new NotFoundException(Msg.Get("AnnouncementNotFound"));
}
