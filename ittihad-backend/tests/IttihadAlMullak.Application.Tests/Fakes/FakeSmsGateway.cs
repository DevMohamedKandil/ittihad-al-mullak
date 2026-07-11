using IttihadAlMullak.Application.Interfaces;

namespace IttihadAlMullak.Application.Tests.Fakes;

public class FakeSmsGateway : ISmsGateway
{
    public readonly List<(string Phone, string Otp)> Sent = [];

    public Task SendOtpAsync(string phone, string otpCode, CancellationToken ct = default)
    {
        Sent.Add((phone, otpCode));
        return Task.CompletedTask;
    }
}
