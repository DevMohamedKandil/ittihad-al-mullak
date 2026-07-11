using System.Security.Cryptography;
using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class AuthService(
    IApplicationDbContext db,
    ITokenService tokens,
    IPasswordHasherService hasher,
    ICurrentUser currentUser,
    ISmsGateway sms,
    IEmailSender email) : IAuthService
{
    private const int RefreshTokenDays = 60; // جلسة طويلة عشان تطبيق الموبايل
    private const int OtpValidMinutes = 5;
    private const int OtpCooldownSeconds = 60;
    private const int OtpMaxAttempts = 5;

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Phone == request.Phone.Trim(), ct)
            ?? throw new BusinessRuleException(Msg.Get("InvalidCredentials"));

        if (!user.IsActive)
            throw new ForbiddenException(Msg.Get("AccountSuspended"));

        if (!hasher.Verify(user.PasswordHash, request.Password))
            throw new BusinessRuleException(Msg.Get("InvalidCredentials"));

        return await IssueTokensAsync(user, user.BuildingId, ct);
    }

    public async Task<AuthResponse> RefreshAsync(RefreshRequest request, CancellationToken ct = default)
    {
        var stored = await db.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == request.RefreshToken, ct);

        if (stored is null || !stored.IsActive || !stored.User.IsActive)
            throw new ForbiddenException(Msg.Get("InvalidSession"));

        stored.RevokedAt = DateTime.UtcNow; // rotation: التوكن القديم بيتلغي
        // بنحافظ على نفس العمارة اللي كانت نشطة، مش نرجعه للعمارة الأساسية كل ما التوكن يتجدد
        return await IssueTokensAsync(stored.User, stored.ActiveBuildingId, ct);
    }

    public async Task<IReadOnlyList<BuildingSummaryDto>> MyBuildingsAsync(CancellationToken ct = default)
    {
        return await db.UserBuildings
            .Where(ub => ub.UserId == currentUser.UserId)
            .OrderBy(ub => ub.Building.Name)
            .Select(ub => new BuildingSummaryDto(ub.Building.Id, ub.Building.Code, ub.Building.Name))
            .ToListAsync(ct);
    }

    public async Task<AuthResponse> SwitchBuildingAsync(SwitchBuildingRequest request, CancellationToken ct = default)
    {
        var isMember = await db.UserBuildings
            .AnyAsync(ub => ub.UserId == currentUser.UserId && ub.BuildingId == request.BuildingId, ct);
        if (!isMember)
            throw new ForbiddenException(Msg.Get("NotBuildingMember"));

        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == currentUser.UserId, ct)
            ?? throw new NotFoundException(Msg.Get("UserNotFound"));

        return await IssueTokensAsync(user, request.BuildingId, ct);
    }

    public async Task<AuthResponse> CreateBuildingAsync(CreateBuildingRequest request, CancellationToken ct = default)
    {
        if (!currentUser.IsAdmin)
            throw new ForbiddenException(Msg.Get("AdminOnly"));

        var buildingsCount = await db.Buildings.CountAsync(ct);
        var building = new Building
        {
            Code = $"BLD-{buildingsCount + 1:D3}",
            Name = request.Name,
            Address = request.Address,
            FloorsCount = request.FloorsCount,
            ApartmentsCount = request.ApartmentsCount,
            MonthlySubscription = request.MonthlySubscription,
            DueDay = request.DueDay,
            Phone = request.Phone,
            WhatsApp = request.WhatsApp,
            Email = request.Email,
        };
        db.Buildings.Add(building);
        await db.SaveChangesAsync(ct);

        db.UserBuildings.Add(new UserBuilding { UserId = currentUser.UserId, BuildingId = building.Id });
        await db.SaveChangesAsync(ct);

        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == currentUser.UserId, ct)
            ?? throw new NotFoundException(Msg.Get("UserNotFound"));

        return await IssueTokensAsync(user, building.Id, ct);
    }

    public async Task<UserDto> MeAsync(CancellationToken ct = default)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == currentUser.UserId, ct)
            ?? throw new NotFoundException(Msg.Get("UserNotFound"));
        return ToDto(user, currentUser.BuildingId);
    }

    public async Task ChangePasswordAsync(ChangePasswordRequest request, CancellationToken ct = default)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == currentUser.UserId, ct)
            ?? throw new NotFoundException(Msg.Get("UserNotFound"));

        if (!hasher.Verify(user.PasswordHash, request.CurrentPassword))
            throw new BusinessRuleException(Msg.Get("WrongCurrentPassword"));

        user.PasswordHash = hasher.Hash(request.NewPassword);
        await db.SaveChangesAsync(ct);
    }

    public async Task RegisterDeviceAsync(RegisterDeviceRequest request, CancellationToken ct = default)
    {
        var exists = await db.DeviceTokens
            .AnyAsync(d => d.UserId == currentUser.UserId && d.Token == request.Token, ct);
        if (exists) return;

        db.DeviceTokens.Add(new DeviceToken
        {
            UserId = currentUser.UserId,
            Token = request.Token,
            Platform = request.Platform,
        });
        await db.SaveChangesAsync(ct);
    }

    public async Task RequestOtpAsync(RequestOtpRequest request, CancellationToken ct = default)
    {
        var phone = request.Phone.Trim();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Phone == phone, ct)
            ?? throw new BusinessRuleException(Msg.Get("PhoneNotRegistered"));
        if (!user.IsActive)
            throw new ForbiddenException(Msg.Get("AccountSuspended"));
        if (request.Channel == OtpChannel.Email && string.IsNullOrWhiteSpace(user.Email))
            throw new BusinessRuleException(Msg.Get("EmailNotRegistered"));

        var recent = await db.OtpCodes
            .Where(o => o.Phone == phone)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync(ct);
        if (recent is not null && recent.CreatedAt > DateTime.UtcNow.AddSeconds(-OtpCooldownSeconds))
            throw new BusinessRuleException(Msg.Get("OtpCooldown"));

        var code = GenerateOtp();
        db.OtpCodes.Add(new OtpCode
        {
            Phone = phone,
            CodeHash = hasher.Hash(code),
            Channel = request.Channel,
            ExpiresAt = DateTime.UtcNow.AddMinutes(OtpValidMinutes),
        });
        await db.SaveChangesAsync(ct);

        if (request.Channel == OtpChannel.Email)
            await email.SendOtpAsync(user.Email!, code, ct);
        else
            await sms.SendOtpAsync(phone, code, ct);
    }

    public async Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest request, CancellationToken ct = default)
    {
        var phone = request.Phone.Trim();
        var otp = await db.OtpCodes
            .Where(o => o.Phone == phone && !o.Consumed)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync(ct)
            ?? throw new BusinessRuleException(Msg.Get("OtpExpired"));

        if (otp.ExpiresAt < DateTime.UtcNow)
            throw new BusinessRuleException(Msg.Get("OtpExpired"));
        if (otp.Attempts >= OtpMaxAttempts)
            throw new BusinessRuleException(Msg.Get("TooManyOtpAttempts"));

        if (!hasher.Verify(otp.CodeHash, request.Code.Trim()))
        {
            otp.Attempts++;
            await db.SaveChangesAsync(ct);
            throw new BusinessRuleException(Msg.Get("InvalidOtp"));
        }

        otp.Consumed = true;

        var user = await db.Users.FirstOrDefaultAsync(u => u.Phone == phone, ct)
            ?? throw new NotFoundException(Msg.Get("UserNotFound"));
        if (!user.IsActive)
            throw new ForbiddenException(Msg.Get("AccountSuspended"));

        await db.SaveChangesAsync(ct);
        return await IssueTokensAsync(user, user.BuildingId, ct);
    }

    private static string GenerateOtp() => RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");

    private async Task<AuthResponse> IssueTokensAsync(User user, int? activeBuildingId, CancellationToken ct)
    {
        var refresh = new RefreshToken
        {
            UserId = user.Id,
            Token = tokens.CreateRefreshToken(),
            ActiveBuildingId = activeBuildingId,
            ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenDays),
        };
        db.RefreshTokens.Add(refresh);
        await db.SaveChangesAsync(ct);

        return new AuthResponse(tokens.CreateAccessToken(user, activeBuildingId), refresh.Token, ToDto(user, activeBuildingId));
    }

    private static UserDto ToDto(User u, int? activeBuildingId = null) =>
        new(u.Id, u.Name, u.Phone, u.Email, u.Role, u.IsActive, activeBuildingId ?? u.BuildingId, u.CreatedAt);
}
