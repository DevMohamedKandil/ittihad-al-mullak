using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/notifications")]
[Authorize]
public class NotificationsController(INotificationService notifications) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<NotificationDto>> Mine(CancellationToken ct)
        => notifications.MyNotificationsAsync(ct);

    [HttpPost("{id:int}/read")]
    public Task MarkRead(int id, CancellationToken ct)
        => notifications.MarkReadAsync(id, ct);

    [HttpPost("read-all")]
    public Task MarkAllRead(CancellationToken ct)
        => notifications.MarkAllReadAsync(ct);
}
