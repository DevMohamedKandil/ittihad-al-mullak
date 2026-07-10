namespace IttihadAlMullak.Application.Dtos;

public record DashboardStatsDto(
    int CollectionRate,          // نسبة التحصيل %
    decimal TotalExpenses,       // إجمالي المصروفات (الشهر الحالي)
    int MaintenanceCount,        // طلبات الصيانة المفتوحة
    int NewMaintenanceCount,     // الجديدة (آخر ٧ أيام)
    int ResidentsCount,          // عدد السكان
    int ApartmentsCount);

public record MonthlyCollectionDto(string Month, decimal Collected, decimal Target);

public record PaymentStatusBreakdownDto(int Paid, int Partial, int Unpaid);

public record CollectionChartDto(
    IReadOnlyList<MonthlyCollectionDto> Monthly,
    PaymentStatusBreakdownDto PaymentStatus);

public record OwnerSummaryDto(
    string Name,
    string? ApartmentNumber,
    int? Floor,
    string BuildingName,
    string BuildingAddress,
    decimal DueAmount,
    DateTime? LastPaymentDate,
    int ActiveMaintenanceCount,
    int NewAnnouncementsCount,
    IReadOnlyList<InvoiceDto> PendingBills,
    IReadOnlyList<AnnouncementDto> LatestAnnouncements);

public record ConversationDto(
    int Id,
    string Name,
    bool IsGroup,
    string? LastMessage,
    DateTime? LastMessageAt,
    int UnreadCount);

public record MessageDto(
    int Id,
    int SenderId,
    string SenderName,
    string Content,
    DateTime SentAt,
    bool Mine);

public record SendMessageRequest(string Content);

public record StartConversationRequest(int? ParticipantUserId); // null = محادثة مع الإدارة
