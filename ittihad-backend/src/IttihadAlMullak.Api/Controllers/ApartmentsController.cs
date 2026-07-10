using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/apartments")]
[Authorize(Roles = "Admin")]
public class ApartmentsController(IApartmentService apartments) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<ApartmentDto>> List([FromQuery] string? search, CancellationToken ct)
        => apartments.ListAsync(search, ct);

    [HttpGet("{id:int}")]
    public Task<ApartmentDto> Get(int id, CancellationToken ct)
        => apartments.GetAsync(id, ct);

    [HttpPost]
    public Task<ApartmentDto> Create(CreateApartmentRequest request, CancellationToken ct)
        => apartments.CreateAsync(request, ct);

    [HttpPut("{id:int}")]
    public Task<ApartmentDto> Update(int id, UpdateApartmentRequest request, CancellationToken ct)
        => apartments.UpdateAsync(id, request, ct);

    [HttpDelete("{id:int}")]
    public Task Delete(int id, CancellationToken ct)
        => apartments.DeleteAsync(id, ct);
}
