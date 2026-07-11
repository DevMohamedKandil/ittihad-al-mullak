using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;

namespace IttihadAlMullak.Application.Tests.Fakes;

public class FakeNotificationService : INotificationService
{
    public Task<IReadOnlyList<NotificationDto>> MyNotificationsAsync(CancellationToken ct = default)
        => Task.FromResult<IReadOnlyList<NotificationDto>>([]);

    public Task MarkReadAsync(int id, CancellationToken ct = default) => Task.CompletedTask;

    public Task MarkAllReadAsync(CancellationToken ct = default) => Task.CompletedTask;

    public Task NotifyAsync(int userId, string title, string body, CancellationToken ct = default)
        => Task.CompletedTask;
}
