using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class ExpenseService(IApplicationDbContext db, ICurrentUser currentUser) : IExpenseService
{
    public async Task<IReadOnlyList<ExpenseDto>> ListAsync(CancellationToken ct = default)
    {
        return await db.Expenses
            .Where(e => e.BuildingId == currentUser.BuildingId)
            .OrderByDescending(e => e.Date)
            .Select(e => new ExpenseDto(e.Id, e.Title, e.Amount, e.Category, e.Date, e.Notes))
            .ToListAsync(ct);
    }

    public async Task<ExpenseDto> CreateAsync(CreateExpenseRequest request, CancellationToken ct = default)
    {
        var expense = new Expense
        {
            BuildingId = currentUser.BuildingId,
            Title = request.Title,
            Amount = request.Amount,
            Category = request.Category,
            Date = request.Date ?? DateTime.UtcNow,
            Notes = request.Notes,
        };
        db.Expenses.Add(expense);
        await db.SaveChangesAsync(ct);
        return new ExpenseDto(expense.Id, expense.Title, expense.Amount, expense.Category, expense.Date, expense.Notes);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var expense = await db.Expenses
            .FirstOrDefaultAsync(e => e.Id == id && e.BuildingId == currentUser.BuildingId, ct)
            ?? throw new NotFoundException(Msg.Get("ExpenseNotFound"));
        db.Expenses.Remove(expense);
        await db.SaveChangesAsync(ct);
    }
}
