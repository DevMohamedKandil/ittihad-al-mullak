using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using IttihadAlMullak.Api.Authorization;
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
    [HasPermission("Announcements.Create")]
    public Task<AnnouncementDto> Create(CreateAnnouncementRequest request, CancellationToken ct)
        => announcements.CreateAsync(request, ct);

    [HttpPut("{id:int}")]
    [HasPermission("Announcements.Edit")]
    public Task<AnnouncementDto> Update(int id, CreateAnnouncementRequest request, CancellationToken ct)
        => announcements.UpdateAsync(id, request, ct);

    [HttpDelete("{id:int}")]
    [HasPermission("Announcements.Delete")]
    public Task Delete(int id, CancellationToken ct)
        => announcements.DeleteAsync(id, ct);
}
