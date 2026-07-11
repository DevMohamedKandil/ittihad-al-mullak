using IttihadAlMullak.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace IttihadAlMullak.Infrastructure.Sms;

/// <summary>
/// تنفيذ محلي للتطوير — بيسجّل كود الـ OTP في اللوج بدل إرساله فعلياً.
/// بيتفعّل تلقائياً لما إعدادات SMS Misr مش موجودة (DependencyInjection.cs).
/// </summary>
public class ConsoleSmsGateway(ILogger<ConsoleSmsGateway> logger) : ISmsGateway
{
    public Task SendOtpAsync(string phone, string otpCode, CancellationToken ct = default)
    {
        logger.LogInformation("[SMS Mock] OTP {OtpCode} → {Phone} (لا يوجد مزوّد SMS حقيقي مُعدّ بعد)", otpCode, phone);
        return Task.CompletedTask;
    }
}
