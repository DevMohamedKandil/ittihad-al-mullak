using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Domain;

namespace IttihadAlMullak.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<AuthResponse> RefreshAsync(RefreshRequest request, CancellationToken ct = default);
    Task<UserDto> MeAsync(CancellationToken ct = default);
    Task ChangePasswordAsync(ChangePasswordRequest request, CancellationToken ct = default);
    Task RegisterDeviceAsync(RegisterDeviceRequest request, CancellationToken ct = default);
}

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default);
    Task<CollectionChartDto> GetCollectionChartAsync(CancellationToken ct = default);
}

public interface IApartmentService
{
    Task<IReadOnlyList<ApartmentDto>> ListAsync(string? search, CancellationToken ct = default);
    Task<ApartmentDto> GetAsync(int id, CancellationToken ct = default);
    Task<ApartmentDto> CreateAsync(CreateApartmentRequest request, CancellationToken ct = default);
    Task<ApartmentDto> UpdateAsync(int id, UpdateApartmentRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}

public interface IInvoiceService
{
    Task<PagedResult<InvoiceDto>> ListAsync(string? status, string? period, string? search, int page, int pageSize, CancellationToken ct = default);
    Task<InvoicesSummaryDto> GetSummaryAsync(CancellationToken ct = default);
    Task<IReadOnlyList<InvoiceDto>> CreateAsync(CreateInvoiceRequest request, CancellationToken ct = default);
    Task<InvoiceDto> AddPaymentAsync(int invoiceId, AddPaymentRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<PaymentDto>> GetPaymentsAsync(int invoiceId, CancellationToken ct = default);
    Task<SendRemindersResult> SendRemindersAsync(CancellationToken ct = default);
}

public interface IExpenseService
{
    Task<IReadOnlyList<ExpenseDto>> ListAsync(CancellationToken ct = default);
    Task<ExpenseDto> CreateAsync(CreateExpenseRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}

public interface IMaintenanceService
{
    Task<IReadOnlyList<MaintenanceDto>> ListAsync(MaintenanceStatus? status, CancellationToken ct = default);
    Task<MaintenanceDto> GetAsync(int id, CancellationToken ct = default);
    Task<MaintenanceDto> CreateAsync(CreateMaintenanceRequest request, CancellationToken ct = default);
    Task<MaintenanceDto> UpdateStatusAsync(int id, UpdateMaintenanceStatusRequest request, CancellationToken ct = default);
    Task<MaintenanceDto> AddPhotoAsync(int id, Stream content, string fileName, CancellationToken ct = default);
}

public interface IAnnouncementService
{
    Task<IReadOnlyList<AnnouncementDto>> ListAsync(CancellationToken ct = default);
    Task<AnnouncementDto> CreateAsync(CreateAnnouncementRequest request, CancellationToken ct = default);
    Task<AnnouncementDto> UpdateAsync(int id, CreateAnnouncementRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}

public interface IUserService
{
    Task<IReadOnlyList<UserListDto>> ListAsync(UserRole? role, string? search, CancellationToken ct = default);
    Task<UserListDto> CreateAsync(CreateUserRequest request, CancellationToken ct = default);
    Task<UserListDto> UpdateAsync(int id, UpdateUserRequest request, CancellationToken ct = default);
}

public interface ISettingsService
{
    Task<BuildingSettingsDto> GetAsync(CancellationToken ct = default);
    Task<BuildingSettingsDto> UpdateAsync(UpdateBuildingSettingsRequest request, CancellationToken ct = default);
}

public interface IOwnerService
{
    Task<OwnerSummaryDto> GetSummaryAsync(CancellationToken ct = default);
    Task<IReadOnlyList<InvoiceDto>> MyBillsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<MaintenanceDto>> MyMaintenanceAsync(CancellationToken ct = default);
}

public interface IMessageService
{
    Task<IReadOnlyList<ConversationDto>> MyConversationsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<MessageDto>> GetMessagesAsync(int conversationId, CancellationToken ct = default);
    Task<MessageDto> SendAsync(int conversationId, SendMessageRequest request, CancellationToken ct = default);
    Task<ConversationDto> StartAsync(StartConversationRequest request, CancellationToken ct = default);
}

public interface INotificationService
{
    Task<IReadOnlyList<NotificationDto>> MyNotificationsAsync(CancellationToken ct = default);
    Task MarkReadAsync(int id, CancellationToken ct = default);
    Task MarkAllReadAsync(CancellationToken ct = default);
    /// <summary>إنشاء إشعار داخلي — بتستخدمها خدمات تانية (زي تذكيرات الفواتير).</summary>
    Task NotifyAsync(int userId, string title, string body, CancellationToken ct = default);
}
