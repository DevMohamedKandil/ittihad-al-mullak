namespace IttihadAlMullak.Domain.Entities;

public class Invoice
{
    public int Id { get; set; }
    public string Number { get; set; } = string.Empty; // INV-001
    public int BuildingId { get; set; }
    public Building Building { get; set; } = null!;
    public int ApartmentId { get; set; }
    public Apartment Apartment { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty; // "يناير 2026"
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public InvoiceType Type { get; set; }
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Unpaid;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Payment> Payments { get; set; } = [];

    /// <summary>الدفعات المؤكدة بس (Pending من بوابة دفع أونلاين لسه مستنية الـ webhook مش بتتحسب).</summary>
    public decimal PaidAmount => Payments.Where(p => p.Status == PaymentStatus.Completed).Sum(p => p.Amount);
    public bool IsOverdue => Status != InvoiceStatus.Paid && DueDate < DateTime.UtcNow;

    /// <summary>الدفع الجزئي: مجموع الدفعات هو اللي بيحدد حالة الفاتورة.</summary>
    public void RecalculateStatus()
    {
        var paid = PaidAmount;
        Status = paid <= 0 ? InvoiceStatus.Unpaid
            : paid >= Amount ? InvoiceStatus.Paid
            : InvoiceStatus.Partial;
    }
}

public class Payment
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = null!;
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public int? PaidById { get; set; }
    public User? PaidBy { get; set; }
    public DateTime PaidAt { get; set; } = DateTime.UtcNow;
    public string? Reference { get; set; }
    /// <summary>Completed افتراضيًا (تسجيل يدوي/كاش) — Pending بس لدفعات أونلاين حقيقية لحد ما الـ webhook يأكّدها.</summary>
    public PaymentStatus Status { get; set; } = PaymentStatus.Completed;
}

public class Expense
{
    public int Id { get; set; }
    public int BuildingId { get; set; }
    public Building Building { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }
}
