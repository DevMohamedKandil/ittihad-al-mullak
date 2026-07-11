using IttihadAlMullak.Application.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace IttihadAlMullak.Infrastructure.Email;

/// <summary>تنفيذ حقيقي عبر SMTP (MailKit) — يشتغل مع Gmail أو أي مزوّد SMTP تاني.</summary>
public class SmtpEmailSender(IOptions<SmtpOptions> options) : IEmailSender
{
    public async Task SendOtpAsync(string email, string otpCode, CancellationToken ct = default)
    {
        var settings = options.Value;

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(settings.DisplayName, settings.Username));
        message.To.Add(MailboxAddress.Parse(email));
        message.Subject = "كود الدخول — اتحاد الملاك";
        message.Body = new TextPart("plain")
        {
            Text = $"كود الدخول الخاص بك: {otpCode}\nصالح لمدة 5 دقائق، ولا تشاركه مع أحد.",
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(settings.Host, settings.Port, SecureSocketOptions.StartTls, ct);
        await client.AuthenticateAsync(settings.Username, settings.Password, ct);
        await client.SendAsync(message, ct);
        await client.DisconnectAsync(true, ct);
    }
}
