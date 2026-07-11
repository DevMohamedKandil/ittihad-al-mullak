using System.ComponentModel.DataAnnotations;
using IttihadAlMullak.Domain;

namespace IttihadAlMullak.Application.Dtos;

public record InvoiceDto(
    int Id,
    string Number,
    int ApartmentId,
    string ApartmentNumber,
    string? OwnerName,
    string Title,
    string Period,
    decimal Amount,
    decimal PaidAmount,
    DateTime DueDate,
    InvoiceType Type,
    string Status, // "paid" | "partial" | "unpaid" | "overdue"
    DateTime CreatedAt);

public record CreateInvoiceRequest(
    int? ApartmentId, // null = فاتورة لكل الشقق
    [Required] string Title,
    [Required] string Period,
    [Range(0.01, double.MaxValue)] decimal Amount,
    DateTime DueDate,
    InvoiceType Type);

public record AddPaymentRequest(
    [Range(0.01, double.MaxValue)] decimal Amount,
    PaymentMethod Method,
    string? Reference);

public record PaymentDto(int Id, decimal Amount, PaymentMethod Method, string? PaidByName, DateTime PaidAt, string? Reference);

public record CreateCheckoutRequest([Range(0.01, double.MaxValue)] decimal Amount);

/// <summary>رابط صفحة الدفع المستضافة عند بوابة الدفع — الفرونت بيحوّل المستخدم ليه مباشرة.</summary>
public record CheckoutResponseDto(string CheckoutUrl);

public record InvoicesSummaryDto(
    int TotalCount,
    decimal TotalAmount,
    decimal CollectedAmount,
    decimal OverdueAmount,
    int CollectionRate); // نسبة مئوية

public record SendRemindersResult(int NotifiedOwners);

public record ExpenseDto(int Id, string Title, decimal Amount, string Category, DateTime Date, string? Notes);

public record CreateExpenseRequest([Required] string Title, [Range(0.01, double.MaxValue)] decimal Amount, [Required] string Category, DateTime? Date, string? Notes);
