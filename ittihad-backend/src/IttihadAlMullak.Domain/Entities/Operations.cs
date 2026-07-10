namespace IttihadAlMullak.Domain.Entities;

public class MaintenanceRequest
{
    public int Id { get; set; }
    public int BuildingId { get; set; }
    public Building Building { get; set; } = null!;
    public int? ApartmentId { get; set; } // null = مرافق عامة
    public Apartment? Apartment { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Category { get; set; } // سباكة، كهرباء...
    public int RequesterId { get; set; }
    public User Requester { get; set; } = null!;
    public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Pending;
    public MaintenancePriority Priority { get; set; } = MaintenancePriority.Medium;
    public string? AssignedTo { get; set; } // الجهة المسؤولة عند "جاري التنفيذ"
    public string? RejectionReason { get; set; }
    public List<string> Photos { get; set; } = []; // مسارات صور الطلب (تتخزن JSON)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
}

public class Announcement
{
    public int Id { get; set; }
    public int BuildingId { get; set; }
    public Building Building { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public AnnouncementType Type { get; set; } = AnnouncementType.General;
    public bool IsPinned { get; set; }
    public int CreatedById { get; set; }
    public User CreatedBy { get; set; } = null!;
    public DateTime? ScheduledAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Notification
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public NotificationChannel Channel { get; set; } = NotificationChannel.InApp;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
