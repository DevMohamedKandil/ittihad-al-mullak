using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.Extensions.Options;

namespace IttihadAlMullak.Infrastructure.Push;

/// <summary>تنفيذ حقيقي عبر Firebase Cloud Messaging (Firebase Admin SDK الرسمي).</summary>
public class FirebasePushSender : IPushNotificationSender
{
    private readonly FirebaseMessaging messaging;

    public FirebasePushSender(IOptions<FirebaseOptions> options)
    {
        var app = FirebaseApp.DefaultInstance ?? FirebaseApp.Create(new AppOptions
        {
            Credential = CredentialFactory.FromJson<ServiceAccountCredential>(options.Value.ServiceAccountJson).ToGoogleCredential(),
        });
        messaging = FirebaseMessaging.GetMessaging(app);
    }

    public async Task SendAsync(IReadOnlyList<string> deviceTokens, string title, string body, CancellationToken ct = default)
    {
        if (deviceTokens.Count == 0) return;

        var message = new MulticastMessage
        {
            // Tokens (registration tokens كلاسيكية) لسه مدعومة بالكامل من FCM، ده بس تحذير توجيهي لـ Fids
            // (Firebase Installation IDs) — تبنيها يحتاج SDK عميل مختلف تمامًا، خارج نطاق العمل الحالي.
#pragma warning disable CS0618
            Tokens = deviceTokens,
#pragma warning restore CS0618
            Notification = new Notification { Title = title, Body = body },
        };
        await messaging.SendEachForMulticastAsync(message, ct);
    }
}
