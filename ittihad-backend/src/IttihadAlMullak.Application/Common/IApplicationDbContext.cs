using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Common;

/// <summary>
/// تجريد قاعدة البيانات — طبقة Application بتتعامل مع العقد ده،
/// و Infrastructure هي اللي بتنفّذه بـ EF Core (Dependency Inversion).
/// </summary>
public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<DeviceToken> DeviceTokens { get; }
    DbSet<UserBuilding> UserBuildings { get; }
    DbSet<Building> Buildings { get; }
    DbSet<Apartment> Apartments { get; }
    DbSet<Invoice> Invoices { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Expense> Expenses { get; }
    DbSet<MaintenanceRequest> MaintenanceRequests { get; }
    DbSet<Announcement> Announcements { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<Conversation> Conversations { get; }
    DbSet<ConversationParticipant> ConversationParticipants { get; }
    DbSet<Message> Messages { get; }
    DbSet<Screen> Screens { get; }
    DbSet<PermissionAction> PermissionActions { get; }
    DbSet<RolePermission> RolePermissions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
