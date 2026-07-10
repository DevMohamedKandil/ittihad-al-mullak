using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class UserService(
    IApplicationDbContext db,
    ICurrentUser currentUser,
    IPasswordHasherService hasher) : IUserService
{
    public async Task<IReadOnlyList<UserListDto>> ListAsync(UserRole? role, string? search, CancellationToken ct = default)
    {
        var query = db.Users.Where(u => u.BuildingId == currentUser.BuildingId);
        if (role is not null) query = query.Where(u => u.Role == role);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(u => u.Name.Contains(term) || u.Phone.Contains(term));
        }

        var users = await query.OrderBy(u => u.Name).ToListAsync(ct);
        var apartments = await db.Apartments
            .Where(a => a.BuildingId == currentUser.BuildingId)
            .ToListAsync(ct);

        return users.Select(u => ToDto(u, apartments)).ToList();
    }

    public async Task<UserListDto> CreateAsync(CreateUserRequest request, CancellationToken ct = default)
    {
        var phoneTaken = await db.Users.AnyAsync(u => u.Phone == request.Phone.Trim(), ct);
        if (phoneTaken)
            throw new BusinessRuleException(Msg.Get("PhoneTaken"));

        var user = new User
        {
            Name = request.Name,
            Phone = request.Phone.Trim(),
            Email = request.Email,
            PasswordHash = hasher.Hash(request.Password),
            Role = request.Role,
            BuildingId = currentUser.BuildingId,
        };
        db.Users.Add(user);
        await db.SaveChangesAsync(ct);

        // ربط المستخدم بشقة (مالك أو مستأجر حسب الدور)
        if (request.ApartmentId is int apartmentId)
        {
            var apartment = await db.Apartments
                .FirstOrDefaultAsync(a => a.Id == apartmentId && a.BuildingId == currentUser.BuildingId, ct)
                ?? throw new NotFoundException(Msg.Get("ApartmentNotFound"));
            if (request.Role == UserRole.Tenant) apartment.TenantId = user.Id;
            else apartment.OwnerId = user.Id;
            await db.SaveChangesAsync(ct);
        }

        var apartments = await db.Apartments.Where(a => a.BuildingId == currentUser.BuildingId).ToListAsync(ct);
        return ToDto(user, apartments);
    }

    public async Task<UserListDto> UpdateAsync(int id, UpdateUserRequest request, CancellationToken ct = default)
    {
        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Id == id && u.BuildingId == currentUser.BuildingId, ct)
            ?? throw new NotFoundException("المستخدم غير موجود");

        if (request.Name is not null) user.Name = request.Name;
        if (request.Email is not null) user.Email = request.Email;
        if (request.IsActive is not null)
        {
            if (user.Id == currentUser.UserId && request.IsActive == false)
                throw new BusinessRuleException(Msg.Get("CannotDeactivateSelf"));
            user.IsActive = request.IsActive.Value;
        }
        await db.SaveChangesAsync(ct);

        var apartments = await db.Apartments.Where(a => a.BuildingId == currentUser.BuildingId).ToListAsync(ct);
        return ToDto(user, apartments);
    }

    private static UserListDto ToDto(User u, List<Apartment> apartments)
    {
        var apartment = apartments.FirstOrDefault(a => a.OwnerId == u.Id || a.TenantId == u.Id);
        return new UserListDto(u.Id, u.Name, u.Phone, u.Email, u.Role, u.IsActive, apartment?.Number, u.CreatedAt);
    }
}
