using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/announcements")]
[Authorize]
public class AnnouncementsController(IAnnouncementService announcements) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<AnnouncementDto>> List(CancellationToken ct)
        => announcements.ListAsync(ct);

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public Task<AnnouncementDto> Create(CreateAnnouncementRequest request, CancellationToken ct)
        => announcements.CreateAsync(request, ct);

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public Task<AnnouncementDto> Update(int id, CreateAnnouncementRequest request, CancellationToken ct)
        => announcements.UpdateAsync(id, request, ct);

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public Task Delete(int id, CancellationToken ct)
        => announcements.DeleteAsync(id, ct);
}
