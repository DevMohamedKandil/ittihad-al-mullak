using System.Text.Json;
using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class InvoiceService(
    IApplicationDbContext db,
    ICurrentUser currentUser,
    INotificationService notifications,
    IPaymentGateway paymentGateway) : IInvoiceService
{
    public async Task<PagedResult<InvoiceDto>> ListAsync(
        string? status, string? period, string? search, int page, int pageSize, CancellationToken ct = default)
    {
        var invoices = await BaseQuery()
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(ct);

        // فلترة الحالة في الذاكرة لأن "overdue" حالة محسوبة من تاريخ الاستحقاق
        var filtered = invoices.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(status) && status != "all")
            filtered = filtered.Where(i => i.ToStatusString() == status);
        if (!string.IsNullOrWhiteSpace(period))
            filtered = filtered.Where(i => i.Period == period);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            filtered = filtered.Where(i =>
                i.Number.Contains(term) ||
                i.Apartment.Number.Contains(term) ||
                (i.Apartment.Owner?.Name.Contains(term) ?? false));
        }

        var list = filtered.ToList();
        var items = list
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(i => i.ToDto())
            .ToList();

        return new PagedResult<InvoiceDto>(items, list.Count, page, pageSize);
    }

    public async Task<InvoicesSummaryDto> GetSummaryAsync(CancellationToken ct = default)
    {
        var invoices = await BaseQuery().ToListAsync(ct);
        var total = invoices.Sum(i => i.Amount);
        var collected = invoices.Sum(i => Math.Min(i.PaidAmount, i.Amount));
        var overdue = invoices.Where(i => i.IsOverdue).Sum(i => i.Amount - i.PaidAmount);
        var rate = total > 0 ? (int)Math.Round(collected / total * 100) : 0;
        return new InvoicesSummaryDto(invoices.Count, total, collected, Math.Max(overdue, 0), rate);
    }

    public async Task<IReadOnlyList<InvoiceDto>> CreateAsync(CreateInvoiceRequest request, CancellationToken ct = default)
    {
        var buildingId = currentUser.BuildingId;

        List<Apartment> targets;
        if (request.ApartmentId is int apartmentId)
        {
            var apartment = await db.Apartments
                .FirstOrDefaultAsync(a => a.Id == apartmentId && a.BuildingId == buildingId, ct)
                ?? throw new NotFoundException(Msg.Get("ApartmentNotFound"));
            targets = [apartment];
        }
        else
        {
            // فاتورة جماعية: لكل شقق العمارة (الإصدار الشهري)
            targets = await db.Apartments.Where(a => a.BuildingId == buildingId).ToListAsync(ct);
            if (targets.Count == 0)
                throw new BusinessRuleException(Msg.Get("NoApartments"));
        }

        var lastNumber = await db.Invoices.CountAsync(i => i.BuildingId == buildingId, ct);
        var created = new List<Invoice>();
        foreach (var apartment in targets)
        {
            lastNumber++;
            created.Add(new Invoice
            {
                Number = $"INV-{lastNumber:D3}",
                BuildingId = buildingId,
                ApartmentId = apartment.Id,
                Title = request.Title,
                Period = request.Period,
                Amount = request.Amount,
                DueDate = request.DueDate,
                Type = request.Type,
            });
        }

        foreach (var invoice in created) db.Invoices.Add(invoice);
        await db.SaveChangesAsync(ct);

        var ids = created.Select(i => i.Id).ToList();
        var withIncludes = await BaseQuery().Where(i => ids.Contains(i.Id)).ToListAsync(ct);
        return withIncludes.Select(i => i.ToDto()).ToList();
    }

    public async Task<InvoiceDto> AddPaymentAsync(int invoiceId, AddPaymentRequest request, CancellationToken ct = default)
    {
        var invoice = await BaseQuery().FirstOrDefaultAsync(i => i.Id == invoiceId, ct)
            ?? throw new NotFoundException(Msg.Get("InvoiceNotFound"));

        // المالك يدفع فواتير شقته فقط
        if (!currentUser.IsAdmin && invoice.Apartment.OwnerId != currentUser.UserId && invoice.Apartment.TenantId != currentUser.UserId)
            throw new ForbiddenException(Msg.Get("NotYourInvoice"));

        var remaining = invoice.Amount - invoice.PaidAmount;
        if (remaining <= 0)
            throw new BusinessRuleException(Msg.Get("AlreadyPaid"));
        if (request.Amount > remaining)
            throw new BusinessRuleException(Msg.Format("AmountExceedsRemaining", remaining));

        // الدفع الإلكتروني بيمر على بوابة الدفع (Mock حالياً — فوري/Paymob لاحقاً بنفس العقد)
        var reference = request.Reference;
        if (string.IsNullOrWhiteSpace(reference) && request.Method != PaymentMethod.Cash)
        {
            var payerPhone = await db.Users
                .Where(u => u.Id == currentUser.UserId)
                .Select(u => u.Phone)
                .FirstAsync(ct);
            reference = await paymentGateway.ChargeAsync(request.Amount, request.Method, payerPhone, ct);
        }

        invoice.Payments.Add(new Payment
        {
            InvoiceId = invoice.Id,
            Amount = request.Amount,
            Method = request.Method,
            PaidById = currentUser.UserId,
            Reference = reference,
        });
        invoice.RecalculateStatus();
        await db.SaveChangesAsync(ct);

        return invoice.ToDto();
    }

    public async Task<CheckoutResponseDto> CreateCheckoutAsync(int invoiceId, CreateCheckoutRequest request, CancellationToken ct = default)
    {
        var invoice = await BaseQuery().FirstOrDefaultAsync(i => i.Id == invoiceId, ct)
            ?? throw new NotFoundException(Msg.Get("InvoiceNotFound"));

        if (!currentUser.IsAdmin && invoice.Apartment.OwnerId != currentUser.UserId && invoice.Apartment.TenantId != currentUser.UserId)
            throw new ForbiddenException(Msg.Get("NotYourInvoice"));

        var remaining = invoice.Amount - invoice.PaidAmount;
        if (remaining <= 0)
            throw new BusinessRuleException(Msg.Get("AlreadyPaid"));
        if (request.Amount > remaining)
            throw new BusinessRuleException(Msg.Format("AmountExceedsRemaining", remaining));

        var payer = await db.Users.FirstAsync(u => u.Id == currentUser.UserId, ct);
        var specialReference = $"INV{invoice.Id}-{Guid.NewGuid():N}";

        var checkoutUrl = await paymentGateway.CreateCheckoutAsync(
            request.Amount, specialReference, payer.Name, payer.Phone, payer.Email, ct);

        invoice.Payments.Add(new Payment
        {
            InvoiceId = invoice.Id,
            Amount = request.Amount,
            Method = PaymentMethod.Card,
            PaidById = currentUser.UserId,
            Reference = specialReference,
            Status = PaymentStatus.Pending,
        });
        await db.SaveChangesAsync(ct);

        return new CheckoutResponseDto(checkoutUrl);
    }

    public async Task HandlePaymentWebhookAsync(JsonElement transaction, string providedHmac, CancellationToken ct = default)
    {
        if (!paymentGateway.VerifyWebhookSignature(transaction, providedHmac))
            throw new ForbiddenException(Msg.Get("InvalidWebhookSignature"));

        if (!transaction.TryGetProperty("order", out var order) || !order.TryGetProperty("merchant_order_id", out var referenceProp))
            return; // شكل غير متوقع للـ webhook — يتجاهل بدل ما يكسر

        var specialReference = referenceProp.GetString();
        var payment = await db.Payments
            .Include(p => p.Invoice)
            .FirstOrDefaultAsync(p => p.Reference == specialReference && p.Status == PaymentStatus.Pending, ct);
        if (payment is null) return; // مفيش دفعة مستنية بهذا المرجع (تكرار callback أو مرجع غير معروف)

        var success = transaction.TryGetProperty("success", out var successProp) && successProp.GetBoolean();
        var pending = transaction.TryGetProperty("pending", out var pendingProp) && pendingProp.GetBoolean();

        payment.Status = success ? PaymentStatus.Completed : pending ? PaymentStatus.Pending : PaymentStatus.Failed;
        if (payment.Status != PaymentStatus.Pending)
            payment.Invoice.RecalculateStatus();

        await db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<PaymentDto>> GetPaymentsAsync(int invoiceId, CancellationToken ct = default)
    {
        var payments = await db.Payments
            .Include(p => p.PaidBy)
            .Where(p => p.InvoiceId == invoiceId && p.Invoice.BuildingId == currentUser.BuildingId)
            .OrderByDescending(p => p.PaidAt)
            .ToListAsync(ct);

        return payments
            .Select(p => new PaymentDto(p.Id, p.Amount, p.Method, p.PaidBy?.Name, p.PaidAt, p.Reference))
            .ToList();
    }

    public async Task<SendRemindersResult> SendRemindersAsync(CancellationToken ct = default)
    {
        var unpaid = await BaseQuery()
            .Where(i => i.Status != InvoiceStatus.Paid)
            .ToListAsync(ct);

        var byUser = unpaid
            .Select(i => new { Invoice = i, UserId = i.Apartment.TenantId ?? i.Apartment.OwnerId })
            .Where(x => x.UserId is not null)
            .GroupBy(x => x.UserId!.Value);

        var notified = 0;
        foreach (var group in byUser)
        {
            var totalDue = group.Sum(x => x.Invoice.Amount - x.Invoice.PaidAmount);
            await notifications.NotifyAsync(
                group.Key,
                "تذكير بسداد المستحقات",
                $"لديك مستحقات غير مسددة بقيمة {totalDue} ج.م، برجاء السداد في أقرب وقت.",
                ct);
            notified++;
        }

        return new SendRemindersResult(notified);
    }

    private IQueryable<Invoice> BaseQuery() => db.Invoices
        .Include(i => i.Payments)
        .Include(i => i.Apartment).ThenInclude(a => a.Owner)
        .Include(i => i.Apartment).ThenInclude(a => a.Tenant)
        .Where(i => i.BuildingId == currentUser.BuildingId);
}
