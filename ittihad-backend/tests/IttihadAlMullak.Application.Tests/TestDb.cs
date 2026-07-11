using IttihadAlMullak.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Tests;

/// <summary>قاعدة بيانات InMemory منفصلة لكل اختبار — عشان الاختبارات ماتأثرش في بعضها.</summary>
public static class TestDb
{
    public static AppDbContext New()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }
}
