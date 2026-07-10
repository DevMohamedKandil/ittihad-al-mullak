namespace IttihadAlMullak.Domain.Entities;

public class Building
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty; // BLD-001
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int FloorsCount { get; set; }
    public int ApartmentsCount { get; set; }
    public decimal MonthlySubscription { get; set; } // بالجنيه المصري
    public int DueDay { get; set; } = 15; // يوم الاستحقاق من كل شهر
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string? Email { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Apartment> Apartments { get; set; } = [];
}

public class Apartment
{
    public int Id { get; set; }
    public int BuildingId { get; set; }
    public Building Building { get; set; } = null!;
    public string Number { get; set; } = string.Empty; // ١٠١
    public int Floor { get; set; }
    public int? OwnerId { get; set; }
    public User? Owner { get; set; }
    public int? TenantId { get; set; }
    public User? Tenant { get; set; }

    public ICollection<Invoice> Invoices { get; set; } = [];
}
