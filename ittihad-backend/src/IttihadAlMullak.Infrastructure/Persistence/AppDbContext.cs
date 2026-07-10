using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options), IApplicationDbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<DeviceToken> DeviceTokens => Set<DeviceToken>();
    public DbSet<Building> Buildings => Set<Building>();
    public DbSet<Apartment> Apartments => Set<Apartment>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<MaintenanceRequest> MaintenanceRequests => Set<MaintenanceRequest>();
    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<ConversationParticipant> ConversationParticipants => Set<ConversationParticipant>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Screen> Screens => Set<Screen>();
    public DbSet<PermissionAction> PermissionActions => Set<PermissionAction>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Phone).IsUnique();
            entity.Property(u => u.Name).HasMaxLength(200);
            entity.Property(u => u.Phone).HasMaxLength(20);
        });

        modelBuilder.Entity<RefreshToken>()
            .HasIndex(t => t.Token).IsUnique();

        modelBuilder.Entity<Apartment>(entity =>
        {
            entity.HasIndex(a => new { a.BuildingId, a.Number }).IsUnique();
            entity.HasOne(a => a.Owner).WithMany().HasForeignKey(a => a.OwnerId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(a => a.Tenant).WithMany().HasForeignKey(a => a.TenantId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasIndex(i => new { i.BuildingId, i.Number }).IsUnique();
            entity.HasOne(i => i.Apartment).WithMany(a => a.Invoices).HasForeignKey(i => i.ApartmentId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.PaidBy).WithMany().HasForeignKey(p => p.PaidById).OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<MaintenanceRequest>()
            .HasOne(m => m.Requester).WithMany().HasForeignKey(m => m.RequesterId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Announcement>()
            .HasOne(a => a.CreatedBy).WithMany().HasForeignKey(a => a.CreatedById).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender).WithMany().HasForeignKey(m => m.SenderId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ConversationParticipant>()
            .HasIndex(p => new { p.ConversationId, p.UserId }).IsUnique();

        modelBuilder.Entity<Screen>()
            .HasIndex(s => s.Key).IsUnique();
        modelBuilder.Entity<PermissionAction>()
            .HasIndex(a => a.Key).IsUnique();
        modelBuilder.Entity<RolePermission>()
            .HasIndex(p => new { p.Role, p.ScreenId, p.ActionId }).IsUnique();
    }
}
