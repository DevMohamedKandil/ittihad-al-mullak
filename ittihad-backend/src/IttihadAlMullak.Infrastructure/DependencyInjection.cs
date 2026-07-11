using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Infrastructure.Auth;
using IttihadAlMullak.Infrastructure.Email;
using IttihadAlMullak.Infrastructure.Payments;
using IttihadAlMullak.Infrastructure.Persistence;
using IttihadAlMullak.Infrastructure.Push;
using IttihadAlMullak.Infrastructure.Sms;
using IttihadAlMullak.Infrastructure.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace IttihadAlMullak.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddSingleton<ITokenService, TokenService>();
        services.AddSingleton<IPasswordHasherService, PasswordHasherService>();
        services.AddSingleton<IFileStorage, LocalFileStorage>();

        // Paymob لو الإعدادات موجودة (dotnet user-secrets)، وإلا Mock بيرجع مرجع وهمي زي الأول
        services.Configure<PaymobOptions>(configuration.GetSection(PaymobOptions.SectionName));
        services.AddHttpClient<PaymobGateway>();
        services.AddSingleton<MockPaymentGateway>();
        services.AddSingleton<IPaymentGateway>(sp =>
        {
            var paymobOptions = sp.GetRequiredService<IOptions<PaymobOptions>>().Value;
            return paymobOptions.IsConfigured
                ? sp.GetRequiredService<PaymobGateway>()
                : (IPaymentGateway)sp.GetRequiredService<MockPaymentGateway>();
        });

        // SMS Misr لو الإعدادات موجودة (dotnet user-secrets)، وإلا Mock بيسجّل الكود في اللوج فقط
        services.Configure<SmsMisrOptions>(configuration.GetSection(SmsMisrOptions.SectionName));
        services.AddHttpClient<SmsMisrGateway>();
        services.AddSingleton<ConsoleSmsGateway>();
        services.AddSingleton<ISmsGateway>(sp =>
        {
            var smsOptions = sp.GetRequiredService<IOptions<SmsMisrOptions>>().Value;
            return smsOptions.IsConfigured
                ? sp.GetRequiredService<SmsMisrGateway>()
                : sp.GetRequiredService<ConsoleSmsGateway>();
        });

        // إيميل SMTP لو الإعدادات موجودة، وإلا Mock بيسجّل الكود في اللوج — قناة OTP بديلة لمن يفضّل الإيميل على SMS
        services.Configure<SmtpOptions>(configuration.GetSection(SmtpOptions.SectionName));
        services.AddSingleton<SmtpEmailSender>();
        services.AddSingleton<ConsoleEmailSender>();
        services.AddSingleton<IEmailSender>(sp =>
        {
            var smtpOptions = sp.GetRequiredService<IOptions<SmtpOptions>>().Value;
            return smtpOptions.IsConfigured
                ? sp.GetRequiredService<SmtpEmailSender>()
                : sp.GetRequiredService<ConsoleEmailSender>();
        });

        // Firebase Push لو Service Account موجود، وإلا Mock بيسجّل في اللوج فقط
        services.Configure<FirebaseOptions>(configuration.GetSection(FirebaseOptions.SectionName));
        services.AddSingleton<ConsolePushSender>();
        services.AddSingleton<FirebasePushSender>();
        services.AddSingleton<IPushNotificationSender>(sp =>
        {
            var firebaseOptions = sp.GetRequiredService<IOptions<FirebaseOptions>>().Value;
            return firebaseOptions.IsConfigured
                ? sp.GetRequiredService<FirebasePushSender>()
                : sp.GetRequiredService<ConsolePushSender>();
        });

        return services;
    }
}
