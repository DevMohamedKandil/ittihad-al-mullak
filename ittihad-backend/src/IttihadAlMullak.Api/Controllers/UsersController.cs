using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
[Authorize(Roles = "Admin")]
public class UsersController(IUserService users) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<UserListDto>> List([FromQuery] UserRole? role, [FromQuery] string? search, CancellationToken ct)
        => users.ListAsync(role, search, ct);

    [HttpPost]
    public Task<UserListDto> Create(CreateUserRequest request, CancellationToken ct)
        => users.CreateAsync(request, ct);

    /// <summary>تعديل بيانات المستخدم أو تفعيله/إيقافه (IsActive).</summary>
    [HttpPut("{id:int}")]
    public Task<UserListDto> Update(int id, UpdateUserRequest request, CancellationToken ct)
        => users.UpdateAsync(id, request, ct);
}
