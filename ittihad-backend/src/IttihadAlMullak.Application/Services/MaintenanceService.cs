using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class MaintenanceService(
    IApplicationDbContext db,
    ICurrentUser currentUser,
    INotificationService notifications,
    IFileStorage fileStorage) : IMaintenanceService
{
    public async Task<MaintenanceDto> AddPhotoAsync(int id, Stream content, string fileName, CancellationToken ct = default)
    {
        var entity = await FindAsync(id, ct);
        if (!currentUser.IsAdmin && entity.RequesterId != currentUser.UserId)
            throw new ForbiddenException(Msg.Get("NotYourRequestPhotos"));
        if (entity.Photos.Count >= 5)
            throw new BusinessRuleException(Msg.Get("MaxPhotos"));

        var path = await fileStorage.SaveAsync(content, fileName, ct);
        entity.Photos = [.. entity.Photos, path];
        await db.SaveChangesAsync(ct);
        return entity.ToDto();
    }

    public async Task<IReadOnlyList<MaintenanceDto>> ListAsync(MaintenanceStatus? status, CancellationToken ct = default)
    {
        var query = BaseQuery();
        if (status is not null) query = query.Where(m => m.Status == status);

        // غير الأدمن يشوف طلباته فقط
        if (!currentUser.IsAdmin)
            query = query.Where(m => m.RequesterId == currentUser.UserId);

        var requests = await query.OrderByDescending(m => m.CreatedAt).ToListAsync(ct);
        return requests.Select(r => r.ToDto()).ToList();
    }

    public async Task<MaintenanceDto> GetAsync(int id, CancellationToken ct = default)
    {
        var request = await FindAsync(id, ct);
        if (!currentUser.IsAdmin && request.RequesterId != currentUser.UserId)
            throw new ForbiddenException(Msg.Get("NotYourRequest"));
        return request.ToDto();
    }

    public async Task<MaintenanceDto> CreateAsync(CreateMaintenanceRequest request, CancellationToken ct = default)
    {
        var entity = new MaintenanceRequest
        {
            BuildingId = currentUser.BuildingId,
            ApartmentId = request.ApartmentId,
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Priority = request.Priority,
            RequesterId = currentUser.UserId,
        };
        db.MaintenanceRequests.Add(entity);
        await db.SaveChangesAsync(ct);
        return (await FindAsync(entity.Id, ct)).ToDto();
    }

    public async Task<MaintenanceDto> UpdateStatusAsync(int id, UpdateMaintenanceStatusRequest request, CancellationToken ct = default)
    {
        var entity = await FindAsync(id, ct);

        if (request.Status == MaintenanceStatus.Rejected && string.IsNullOrWhiteSpace(request.RejectionReason))
            throw new BusinessRuleException(Msg.Get("RejectionReasonRequired"));

        entity.Status = request.Status;
        entity.AssignedTo = request.Status == MaintenanceStatus.InProgress ? request.AssignedTo : entity.AssignedTo;
        entity.RejectionReason = request.Status == MaintenanceStatus.Rejected ? request.RejectionReason : null;
        entity.ResolvedAt = request.Status == MaintenanceStatus.Completed ? DateTime.UtcNow : null;
        await db.SaveChangesAsync(ct);

        // إخطار صاحب الطلب بتغيير الحالة
        var statusLabel = request.Status switch
        {
            MaintenanceStatus.InProgress => "جاري التنفيذ",
            MaintenanceStatus.Completed => "مكتمل",
            MaintenanceStatus.Rejected => "مرفوض",
            _ => "قيد الانتظار",
        };
        await notifications.NotifyAsync(
            entity.RequesterId,
            "تحديث طلب الصيانة",
            $"طلبك \"{entity.Title}\" أصبح: {statusLabel}",
            ct);

        return entity.ToDto();
    }

    private IQueryable<MaintenanceRequest> BaseQuery() => db.MaintenanceRequests
        .Include(m => m.Apartment)
        .Include(m => m.Requester)
        .Where(m => m.BuildingId == currentUser.BuildingId);

    private async Task<MaintenanceRequest> FindAsync(int id, CancellationToken ct)
        => await BaseQuery().FirstOrDefaultAsync(m => m.Id == id, ct)
        ?? throw new NotFoundException(Msg.Get("MaintenanceNotFound"));
}
