using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Services;
using IttihadAlMullak.Application.Tests.Fakes;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using IttihadAlMullak.Infrastructure.Auth;
using Xunit;

namespace IttihadAlMullak.Application.Tests;

public class AuthServiceTests
{
    private static readonly PasswordHasherService Hasher = new();

    private static (AuthService service, FakeCurrentUser currentUser, Infrastructure.Persistence.AppDbContext db, FakeSmsGateway sms, FakeEmailSender email) Build()
    {
        var db = TestDb.New();
        var currentUser = new FakeCurrentUser();
        var sms = new FakeSmsGateway();
        var email = new FakeEmailSender();
        var service = new AuthService(db, new FakeTokenService(), Hasher, currentUser, sms, email);
        return (service, currentUser, db, sms, email);
    }

    private static User SeedUser(Infrastructure.Persistence.AppDbContext db, int buildingId, UserRole role = UserRole.Admin, bool isActive = true)
    {
        var user = new User
        {
            Name = "مستخدم تجريبي",
            Phone = "01000000000",
            PasswordHash = Hasher.Hash("123456"),
            Role = role,
            BuildingId = buildingId,
            IsActive = isActive,
        };
        db.Buildings.Add(new Building { Id = buildingId, Code = $"BLD-{buildingId:D3}", Name = $"عمارة {buildingId}" });
        db.Users.Add(user);
        db.SaveChanges();
        db.UserBuildings.Add(new UserBuilding { UserId = user.Id, BuildingId = buildingId });
        db.SaveChanges();
        return user;
    }

    [Fact]
    public async Task Login_WithValidCredentials_IssuesTokenForPrimaryBuilding()
    {
        var (service, _, db, _, _) = Build();
        SeedUser(db, buildingId: 1);

        var result = await service.LoginAsync(new LoginRequest("01000000000", "123456"));

        Assert.Contains("building=1", result.AccessToken);
        Assert.Equal(1, result.User.BuildingId);
    }

    [Fact]
    public async Task Login_WithWrongPassword_ThrowsBusinessRuleException()
    {
        var (service, _, db, _, _) = Build();
        SeedUser(db, buildingId: 1);

        await Assert.ThrowsAsync<BusinessRuleException>(
            () => service.LoginAsync(new LoginRequest("01000000000", "wrong-password")));
    }

    [Fact]
    public async Task Login_WithSuspendedAccount_ThrowsForbiddenException()
    {
        var (service, _, db, _, _) = Build();
        SeedUser(db, buildingId: 1, isActive: false);

        await Assert.ThrowsAsync<ForbiddenException>(
            () => service.LoginAsync(new LoginRequest("01000000000", "123456")));
    }

    [Fact]
    public async Task SwitchBuilding_WhenMember_IssuesTokenForThatBuilding()
    {
        var (service, currentUser, db, _, _) = Build();
        var user = SeedUser(db, buildingId: 1);
        db.Buildings.Add(new Building { Id = 2, Code = "BLD-002", Name = "عمارة ثانية" });
        db.UserBuildings.Add(new UserBuilding { UserId = user.Id, BuildingId = 2 });
        db.SaveChanges();
        currentUser.UserId = user.Id;

        var result = await service.SwitchBuildingAsync(new SwitchBuildingRequest(2));

        Assert.Contains("building=2", result.AccessToken);
        Assert.Equal(2, result.User.BuildingId);
    }

    [Fact]
    public async Task SwitchBuilding_WhenNotMember_ThrowsForbiddenException()
    {
        var (service, currentUser, db, _, _) = Build();
        var user = SeedUser(db, buildingId: 1);
        db.Buildings.Add(new Building { Id = 2, Code = "BLD-002", Name = "عمارة ثانية" }); // بلا عضوية للمستخدم
        db.SaveChanges();
        currentUser.UserId = user.Id;

        await Assert.ThrowsAsync<ForbiddenException>(
            () => service.SwitchBuildingAsync(new SwitchBuildingRequest(2)));
    }

    [Fact]
    public async Task CreateBuilding_WhenNotAdmin_ThrowsForbiddenException()
    {
        var (service, currentUser, db, _, _) = Build();
        var user = SeedUser(db, buildingId: 1, role: UserRole.Owner);
        currentUser.UserId = user.Id;
        currentUser.Role = UserRole.Owner;

        await Assert.ThrowsAsync<ForbiddenException>(() => service.CreateBuildingAsync(
            new CreateBuildingRequest("عمارة جديدة", "عنوان", 5, 10, 400, 10, null, null, null)));
    }

    [Fact]
    public async Task CreateBuilding_WhenAdmin_CreatesAndActivatesNewBuilding()
    {
        var (service, currentUser, db, _, _) = Build();
        var user = SeedUser(db, buildingId: 1, role: UserRole.Admin);
        currentUser.UserId = user.Id;
        currentUser.Role = UserRole.Admin;

        var result = await service.CreateBuildingAsync(
            new CreateBuildingRequest("عمارة جديدة", "عنوان", 5, 10, 400, 10, null, null, null));

        Assert.NotEqual(1, result.User.BuildingId);
        Assert.True(db.UserBuildings.Any(ub => ub.UserId == user.Id && ub.BuildingId == result.User.BuildingId));
    }

    [Fact]
    public async Task RequestOtp_ForUnregisteredPhone_ThrowsBusinessRuleException()
    {
        var (service, _, _, _, _) = Build();

        await Assert.ThrowsAsync<BusinessRuleException>(
            () => service.RequestOtpAsync(new RequestOtpRequest("01999999999")));
    }

    [Fact]
    public async Task RequestOtp_ThenVerifyWithCorrectCode_IssuesToken()
    {
        var (service, _, db, sms, _) = Build();
        SeedUser(db, buildingId: 1);

        await service.RequestOtpAsync(new RequestOtpRequest("01000000000"));
        var code = Assert.Single(sms.Sent).Otp;

        var result = await service.VerifyOtpAsync(new VerifyOtpRequest("01000000000", code));

        Assert.Equal(1, result.User.BuildingId);
    }

    [Fact]
    public async Task RequestOtp_TwiceQuickly_ThrowsCooldownException()
    {
        var (service, _, db, _, _) = Build();
        SeedUser(db, buildingId: 1);

        await service.RequestOtpAsync(new RequestOtpRequest("01000000000"));

        await Assert.ThrowsAsync<BusinessRuleException>(
            () => service.RequestOtpAsync(new RequestOtpRequest("01000000000")));
    }

    [Fact]
    public async Task VerifyOtp_WithWrongCode_ThrowsBusinessRuleException()
    {
        var (service, _, db, sms, _) = Build();
        SeedUser(db, buildingId: 1);
        await service.RequestOtpAsync(new RequestOtpRequest("01000000000"));

        await Assert.ThrowsAsync<BusinessRuleException>(
            () => service.VerifyOtpAsync(new VerifyOtpRequest("01000000000", "000000")));
    }

    [Fact]
    public async Task VerifyOtp_AfterAlreadyConsumed_ThrowsBusinessRuleException()
    {
        var (service, _, db, sms, _) = Build();
        SeedUser(db, buildingId: 1);
        await service.RequestOtpAsync(new RequestOtpRequest("01000000000"));
        var code = Assert.Single(sms.Sent).Otp;
        await service.VerifyOtpAsync(new VerifyOtpRequest("01000000000", code));

        await Assert.ThrowsAsync<BusinessRuleException>(
            () => service.VerifyOtpAsync(new VerifyOtpRequest("01000000000", code)));
    }

    [Fact]
    public async Task RequestOtp_ViaEmailChannel_SendsThroughEmailNotSms()
    {
        var (service, _, db, sms, email) = Build();
        var user = SeedUser(db, buildingId: 1);
        user.Email = "owner@example.com";
        db.SaveChanges();

        await service.RequestOtpAsync(new RequestOtpRequest("01000000000", OtpChannel.Email));

        Assert.Single(email.Sent);
        Assert.Empty(sms.Sent);
    }

    [Fact]
    public async Task RequestOtp_ViaEmailChannel_WithNoEmailOnFile_ThrowsBusinessRuleException()
    {
        var (service, _, db, _, _) = Build();
        SeedUser(db, buildingId: 1); // من غير Email

        await Assert.ThrowsAsync<BusinessRuleException>(
            () => service.RequestOtpAsync(new RequestOtpRequest("01000000000", OtpChannel.Email)));
    }
}
