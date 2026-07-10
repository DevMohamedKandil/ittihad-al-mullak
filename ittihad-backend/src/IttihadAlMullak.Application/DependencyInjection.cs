using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace IttihadAlMullak.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IApartmentService, ApartmentService>();
        services.AddScoped<IInvoiceService, InvoiceService>();
        services.AddScoped<IExpenseService, ExpenseService>();
        services.AddScoped<IMaintenanceService, MaintenanceService>();
        services.AddScoped<IAnnouncementService, AnnouncementService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ISettingsService, SettingsService>();
        services.AddScoped<IOwnerService, OwnerService>();
        services.AddScoped<IMessageService, MessageService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddMemoryCache();
        services.AddScoped<IPermissionService, PermissionService>();
        return services;
    }
}
