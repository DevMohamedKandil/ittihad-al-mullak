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
    public DbSet<UserBuilding> UserBuildings => Set<UserBuilding>();
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
            // NoAction عشان SQL Server بيرفض تعدد مسارات الـ cascade (Error 1785)
            entity.HasOne(u => u.Building).WithMany().HasForeignKey(u => u.BuildingId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<RefreshToken>()
            .HasIndex(t => t.Token).IsUnique();

        modelBuilder.Entity<UserBuilding>(entity =>
        {
            entity.HasIndex(ub => new { ub.UserId, ub.BuildingId }).IsUnique();
            entity.HasOne(ub => ub.User).WithMany(u => u.UserBuildings).HasForeignKey(ub => ub.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(ub => ub.Building).WithMany().HasForeignKey(ub => ub.BuildingId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Apartment>(entity =>
        {
            entity.HasIndex(a => new { a.BuildingId, a.Number }).IsUnique();
            entity.HasOne(a => a.Owner).WithMany().HasForeignKey(a => a.OwnerId).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(a => a.Tenant).WithMany().HasForeignKey(a => a.TenantId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasIndex(i => new { i.BuildingId, i.Number }).IsUnique();
            entity.HasOne(i => i.Apartment).WithMany(a => a.Invoices).HasForeignKey(i => i.ApartmentId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(i => i.Building).WithMany().HasForeignKey(i => i.BuildingId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.PaidBy).WithMany().HasForeignKey(p => p.PaidById).OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<MaintenanceRequest>()
            .HasOne(m => m.Requester).WithMany().HasForeignKey(m => m.RequesterId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Announcement>()
            .HasOne(a => a.CreatedBy).WithMany().HasForeignKey(a => a.CreatedById).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender).WithMany().HasForeignKey(m => m.SenderId).OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ConversationParticipant>()
            .HasIndex(p => new { p.ConversationId, p.UserId }).IsUnique();

        // دقة المبالغ على SQL Server (18,2) — جنيه وقروش
        modelBuilder.Entity<Invoice>().Property(i => i.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<Payment>().Property(p => p.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<Expense>().Property(e => e.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<Building>().Property(b => b.MonthlySubscription).HasPrecision(18, 2);

        modelBuilder.Entity<Screen>()
            .HasIndex(s => s.Key).IsUnique();
        modelBuilder.Entity<PermissionAction>()
            .HasIndex(a => a.Key).IsUnique();
        modelBuilder.Entity<RolePermission>()
            .HasIndex(p => new { p.Role, p.ScreenId, p.ActionId }).IsUnique();
    }
}
