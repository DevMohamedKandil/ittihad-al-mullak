using IttihadAlMullak.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace IttihadAlMullak.Infrastructure.Email;

/// <summary>تنفيذ محلي للتطوير — بيسجّل كود الـ OTP في اللوج بدل إرساله فعليًا عبر إيميل حقيقي.</summary>
public class ConsoleEmailSender(ILogger<ConsoleEmailSender> logger) : IEmailSender
{
    public Task SendOtpAsync(string email, string otpCode, CancellationToken ct = default)
    {
        logger.LogInformation("[Email Mock] OTP {OtpCode} → {Email} (لا يوجد إعدادات SMTP حقيقية بعد)", otpCode, email);
        return Task.CompletedTask;
    }
}
