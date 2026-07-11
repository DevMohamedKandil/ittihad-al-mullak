using System.Text.Json;
using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Services;
using IttihadAlMullak.Application.Tests.Fakes;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using IttihadAlMullak.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace IttihadAlMullak.Application.Tests;

public class InvoiceServiceTests
{
    private const int BuildingId = 1;
    private const int OwnerId = 10;
    private const int OtherOwnerId = 20;

    private static (InvoiceService service, AppDbContext db, Invoice invoice, FakePaymentGateway gateway) Build(decimal amount = 500m)
    {
        var db = TestDb.New();
        db.Buildings.Add(new Building { Id = BuildingId, Code = "BLD-001", Name = "عمارة تجريبية" });
        db.Users.Add(new User { Id = OwnerId, Name = "مالك تجريبي", Phone = "01000000010", Role = UserRole.Owner, BuildingId = BuildingId });
        var apartment = new Apartment { Id = 1, BuildingId = BuildingId, Number = "101", OwnerId = OwnerId };
        db.Apartments.Add(apartment);
        var invoice = new Invoice
        {
            Id = 1,
            Number = "INV-001",
            BuildingId = BuildingId,
            ApartmentId = apartment.Id,
            Title = "اشتراك شهري",
            Period = "يوليو 2026",
            Amount = amount,
            DueDate = DateTime.UtcNow.AddDays(10),
            Type = InvoiceType.Monthly,
        };
        db.Invoices.Add(invoice);
        db.SaveChanges();

        var currentUser = new FakeCurrentUser { UserId = OwnerId, Role = UserRole.Owner, BuildingId = BuildingId };
        var gateway = new FakePaymentGateway();
        var service = new InvoiceService(db, currentUser, new FakeNotificationService(), gateway);
        return (service, db, invoice, gateway);
    }

    [Fact]
    public async Task AddPayment_FullAmount_MarksInvoiceAsPaid()
    {
        var (service, _, invoice, _) = Build(amount: 500m);

        var result = await service.AddPaymentAsync(invoice.Id, new AddPaymentRequest(500m, PaymentMethod.Cash, null));

        Assert.Equal("paid", result.Status);
    }

    [Fact]
    public async Task AddPayment_PartialAmount_MarksInvoiceAsPartial()
    {
        var (service, _, invoice, _) = Build(amount: 500m);

        var result = await service.AddPaymentAsync(invoice.Id, new AddPaymentRequest(200m, PaymentMethod.Cash, null));

        Assert.Equal("partial", result.Status);
        Assert.Equal(200m, result.PaidAmount);
    }

    [Fact]
    public async Task AddPayment_ExceedingRemainingBalance_ThrowsBusinessRuleException()
    {
        var (service, _, invoice, _) = Build(amount: 500m);

        await Assert.ThrowsAsync<BusinessRuleException>(
            () => service.AddPaymentAsync(invoice.Id, new AddPaymentRequest(600m, PaymentMethod.Cash, null)));
    }

    [Fact]
    public async Task AddPayment_OnAlreadyFullyPaidInvoice_ThrowsBusinessRuleException()
    {
        var (service, _, invoice, _) = Build(amount: 500m);
        await service.AddPaymentAsync(invoice.Id, new AddPaymentRequest(500m, PaymentMethod.Cash, null));

        await Assert.ThrowsAsync<BusinessRuleException>(
            () => service.AddPaymentAsync(invoice.Id, new AddPaymentRequest(1m, PaymentMethod.Cash, null)));
    }

    [Fact]
    public async Task AddPayment_ByUserWhoIsNeitherOwnerNorTenantNorAdmin_ThrowsForbiddenException()
    {
        var db = TestDb.New();
        db.Buildings.Add(new Building { Id = BuildingId, Code = "BLD-001", Name = "عمارة تجريبية" });
        var apartment = new Apartment { Id = 1, BuildingId = BuildingId, Number = "101", OwnerId = OwnerId };
        db.Apartments.Add(apartment);
        var invoice = new Invoice
        {
            Id = 1,
            Number = "INV-001",
            BuildingId = BuildingId,
            ApartmentId = apartment.Id,
            Title = "اشتراك شهري",
            Period = "يوليو 2026",
            Amount = 500m,
            DueDate = DateTime.UtcNow.AddDays(10),
            Type = InvoiceType.Monthly,
        };
        db.Invoices.Add(invoice);
        db.SaveChanges();

        // مستخدم تاني (مش المالك ولا مستأجر الشقة ولا أدمن) بيحاول يدفع فاتورة مش بتاعته
        var intruder = new FakeCurrentUser { UserId = OtherOwnerId, Role = UserRole.Owner, BuildingId = BuildingId };
        var service = new InvoiceService(db, intruder, new FakeNotificationService(), new FakePaymentGateway());

        await Assert.ThrowsAsync<ForbiddenException>(
            () => service.AddPaymentAsync(invoice.Id, new AddPaymentRequest(500m, PaymentMethod.Cash, null)));
    }

    [Fact]
    public async Task CreateCheckout_CreatesPendingPaymentAndDoesNotAffectInvoiceBalanceYet()
    {
        var (service, db, invoice, gateway) = Build(amount: 500m);

        var result = await service.CreateCheckoutAsync(invoice.Id, new CreateCheckoutRequest(500m));

        Assert.Equal(gateway.CheckoutUrlToReturn, result.CheckoutUrl);
        Assert.NotNull(gateway.LastSpecialReference);
        var reloaded = await db.Invoices.Include(i => i.Payments).FirstAsync(i => i.Id == invoice.Id);
        Assert.Equal(0m, reloaded.PaidAmount); // Pending لسه مش محسوبة كمدفوع
        Assert.Single(reloaded.Payments, p => p.Status == PaymentStatus.Pending);
    }

    [Fact]
    public async Task Webhook_WithValidSignatureAndSuccess_MarksPaymentCompletedAndUpdatesInvoice()
    {
        var (service, db, invoice, gateway) = Build(amount: 500m);
        var checkout = await service.CreateCheckoutAsync(invoice.Id, new CreateCheckoutRequest(500m));
        var reference = gateway.LastSpecialReference!;

        var payload = JsonDocument.Parse($$"""
            { "success": true, "pending": false, "order": { "merchant_order_id": "{{reference}}" } }
            """).RootElement;

        await service.HandlePaymentWebhookAsync(payload, "any-hmac");

        var reloaded = await db.Invoices.Include(i => i.Payments).FirstAsync(i => i.Id == invoice.Id);
        Assert.Equal(500m, reloaded.PaidAmount);
        Assert.Equal("paid", reloaded.ToStatusString());
    }

    [Fact]
    public async Task Webhook_WithFailedTransaction_MarksPaymentFailedWithoutCreditingInvoice()
    {
        var (service, db, invoice, gateway) = Build(amount: 500m);
        await service.CreateCheckoutAsync(invoice.Id, new CreateCheckoutRequest(500m));
        var reference = gateway.LastSpecialReference!;

        var payload = JsonDocument.Parse($$"""
            { "success": false, "pending": false, "order": { "merchant_order_id": "{{reference}}" } }
            """).RootElement;

        await service.HandlePaymentWebhookAsync(payload, "any-hmac");

        var reloaded = await db.Invoices.Include(i => i.Payments).FirstAsync(i => i.Id == invoice.Id);
        Assert.Equal(0m, reloaded.PaidAmount);
        Assert.Single(reloaded.Payments, p => p.Status == PaymentStatus.Failed);
    }

    [Fact]
    public async Task Webhook_WithInvalidSignature_ThrowsForbiddenExceptionAndDoesNotTouchPayment()
    {
        var (service, db, invoice, gateway) = Build(amount: 500m);
        await service.CreateCheckoutAsync(invoice.Id, new CreateCheckoutRequest(500m));
        gateway.SignatureIsValid = false;

        var payload = JsonDocument.Parse($$"""
            { "success": true, "pending": false, "order": { "merchant_order_id": "{{gateway.LastSpecialReference}}" } }
            """).RootElement;

        await Assert.ThrowsAsync<ForbiddenException>(() => service.HandlePaymentWebhookAsync(payload, "bad-hmac"));

        var reloaded = await db.Invoices.Include(i => i.Payments).FirstAsync(i => i.Id == invoice.Id);
        Assert.Single(reloaded.Payments, p => p.Status == PaymentStatus.Pending);
    }
}
