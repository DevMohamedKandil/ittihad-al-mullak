using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain.Entities;

namespace IttihadAlMullak.Application.Tests.Fakes;

/// <summary>بيرجع نص بسيط بيعبّر عن العمارة النشطة، عشان الاختبارات تتأكد منها من غير الحاجة لفك تشفير JWT حقيقي.</summary>
public class FakeTokenService : ITokenService
{
    public string CreateAccessToken(User user, int? activeBuildingId = null)
        => $"token:user={user.Id}:building={activeBuildingId?.ToString() ?? "none"}";

    public string CreateRefreshToken() => Guid.NewGuid().ToString();
}
