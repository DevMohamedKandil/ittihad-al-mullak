using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using IttihadAlMullak.Api.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/apartments")]
[Authorize]
public class ApartmentsController(IApartmentService apartments) : ControllerBase
{
    [HttpGet]
    [HasPermission("Apartments.View")]
    public Task<IReadOnlyList<ApartmentDto>> List([FromQuery] string? search, CancellationToken ct)
        => apartments.ListAsync(search, ct);

    [HttpGet("{id:int}")]
    [HasPermission("Apartments.View")]
    public Task<ApartmentDto> Get(int id, CancellationToken ct)
        => apartments.GetAsync(id, ct);

    [HttpPost]
    [HasPermission("Apartments.Create")]
    public Task<ApartmentDto> Create(CreateApartmentRequest request, CancellationToken ct)
        => apartments.CreateAsync(request, ct);

    [HttpPut("{id:int}")]
    [HasPermission("Apartments.Edit")]
    public Task<ApartmentDto> Update(int id, UpdateApartmentRequest request, CancellationToken ct)
        => apartments.UpdateAsync(id, request, ct);

    [HttpDelete("{id:int}")]
    [HasPermission("Apartments.Delete")]
    public Task Delete(int id, CancellationToken ct)
        => apartments.DeleteAsync(id, ct);
}
