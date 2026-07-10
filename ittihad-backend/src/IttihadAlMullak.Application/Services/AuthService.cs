using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class AuthService(
    IApplicationDbContext db,
    ITokenService tokens,
    IPasswordHasherService hasher,
    ICurrentUser currentUser) : IAuthService
{
    private const int RefreshTokenDays = 60; // جلسة طويلة عشان تطبيق الموبايل

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Phone == request.Phone.Trim(), ct)
            ?? throw new BusinessRuleException(Msg.Get("InvalidCredentials"));

        if (!user.IsActive)
            throw new ForbiddenException(Msg.Get("AccountSuspended"));

        if (!hasher.Verify(user.PasswordHash, request.Password))
            throw new BusinessRuleException(Msg.Get("InvalidCredentials"));

        return await IssueTokensAsync(user, ct);
    }

    public async Task<AuthResponse> RefreshAsync(RefreshRequest request, CancellationToken ct = default)
    {
        var stored = await db.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == request.RefreshToken, ct);

        if (stored is null || !stored.IsActive || !stored.User.IsActive)
            throw new ForbiddenException(Msg.Get("InvalidSession"));

        stored.RevokedAt = DateTime.UtcNow; // rotation: التوكن القديم بيتلغي
        return await IssueTokensAsync(stored.User, ct);
    }

    public async Task<UserDto> MeAsync(CancellationToken ct = default)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == currentUser.UserId, ct)
            ?? throw new NotFoundException(Msg.Get("UserNotFound"));
        return ToDto(user);
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

    private async Task<AuthResponse> IssueTokensAsync(User user, CancellationToken ct)
    {
        var refresh = new RefreshToken
        {
            UserId = user.Id,
            Token = tokens.CreateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenDays),
        };
        db.RefreshTokens.Add(refresh);
        await db.SaveChangesAsync(ct);

        return new AuthResponse(tokens.CreateAccessToken(user), refresh.Token, ToDto(user));
    }

    private static UserDto ToDto(User u) =>
        new(u.Id, u.Name, u.Phone, u.Email, u.Role, u.IsActive, u.BuildingId, u.CreatedAt);
}
