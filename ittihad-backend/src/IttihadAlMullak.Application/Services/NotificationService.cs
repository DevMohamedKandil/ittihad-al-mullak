using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class NotificationService(IApplicationDbContext db, ICurrentUser currentUser) : INotificationService
{
    public async Task<IReadOnlyList<NotificationDto>> MyNotificationsAsync(CancellationToken ct = default)
    {
        return await db.Notifications
            .Where(n => n.UserId == currentUser.UserId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .Select(n => new NotificationDto(n.Id, n.Title, n.Body, n.IsRead, n.CreatedAt))
            .ToListAsync(ct);
    }

    public async Task MarkReadAsync(int id, CancellationToken ct = default)
    {
        var notification = await db.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == currentUser.UserId, ct)
            ?? throw new NotFoundException(Msg.Get("NotificationNotFound"));
        notification.IsRead = true;
        await db.SaveChangesAsync(ct);
    }

    public async Task MarkAllReadAsync(CancellationToken ct = default)
    {
        var unread = await db.Notifications
            .Where(n => n.UserId == currentUser.UserId && !n.IsRead)
            .ToListAsync(ct);
        foreach (var notification in unread) notification.IsRead = true;
        await db.SaveChangesAsync(ct);
    }

    public async Task NotifyAsync(int userId, string title, string body, CancellationToken ct = default)
    {
        // حالياً: إشعار داخل التطبيق فقط.
        // لاحقاً: نفس النقطة دي هتبعت Push (بالـ DeviceTokens) و WhatsApp/SMS.
        db.Notifications.Add(new Notification { UserId = userId, Title = title, Body = body });
        await db.SaveChangesAsync(ct);
    }
}
