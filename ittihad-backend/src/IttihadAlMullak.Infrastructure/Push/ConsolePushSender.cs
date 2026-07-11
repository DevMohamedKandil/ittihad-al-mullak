using IttihadAlMullak.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace IttihadAlMullak.Infrastructure.Push;

/// <summary>تنفيذ محلي للتطوير — بيسجّل الإشعار في اللوج بدل إرساله فعليًا عبر Firebase.</summary>
public class ConsolePushSender(ILogger<ConsolePushSender> logger) : IPushNotificationSender
{
    public Task SendAsync(IReadOnlyList<string> deviceTokens, string title, string body, CancellationToken ct = default)
    {
        if (deviceTokens.Count == 0) return Task.CompletedTask;
        logger.LogInformation(
            "[Push Mock] {Title}: {Body} → {Count} جهاز (لا يوجد إعدادات Firebase حقيقية بعد)",
            title, body, deviceTokens.Count);
        return Task.CompletedTask;
    }
}
