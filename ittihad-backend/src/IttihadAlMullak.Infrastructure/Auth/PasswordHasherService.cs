using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace IttihadAlMullak.Infrastructure.Auth;

/// <summary>غلاف حوالين PasswordHasher بتاع ASP.NET Identity (PBKDF2).</summary>
public class PasswordHasherService : IPasswordHasherService
{
    private static readonly PasswordHasher<User> Hasher = new();
    private static readonly User Dummy = new();

    public string Hash(string password)
        => Hasher.HashPassword(Dummy, password);

    public bool Verify(string hash, string password)
        => Hasher.VerifyHashedPassword(Dummy, hash, password) != PasswordVerificationResult.Failed;
}
