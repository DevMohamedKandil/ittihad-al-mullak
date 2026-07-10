using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using IttihadAlMullak.Api.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/expenses")]
[HasPermission("Expenses.View")]
public class ExpensesController(IExpenseService expenses) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<ExpenseDto>> List(CancellationToken ct)
        => expenses.ListAsync(ct);

    [HttpPost]
    public Task<ExpenseDto> Create(CreateExpenseRequest request, CancellationToken ct)
        => expenses.CreateAsync(request, ct);

    [HttpDelete("{id:int}")]
    public Task Delete(int id, CancellationToken ct)
        => expenses.DeleteAsync(id, ct);
}
