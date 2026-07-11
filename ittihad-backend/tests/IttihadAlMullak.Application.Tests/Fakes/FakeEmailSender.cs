using IttihadAlMullak.Application.Interfaces;

namespace IttihadAlMullak.Application.Tests.Fakes;

public class FakeEmailSender : IEmailSender
{
    public readonly List<(string Email, string Otp)> Sent = [];

    public Task SendOtpAsync(string email, string otpCode, CancellationToken ct = default)
    {
        Sent.Add((email, otpCode));
        return Task.CompletedTask;
    }
}
