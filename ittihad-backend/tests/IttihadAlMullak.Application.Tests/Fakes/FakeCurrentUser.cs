using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;

namespace IttihadAlMullak.Application.Tests.Fakes;

public class FakeCurrentUser : ICurrentUser
{
    public int UserId { get; set; }
    public UserRole Role { get; set; } = UserRole.Admin;
    public int BuildingId { get; set; }
    public bool IsAdmin => Role == UserRole.Admin;
}
