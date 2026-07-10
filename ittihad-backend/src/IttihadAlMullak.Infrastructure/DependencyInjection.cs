using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Infrastructure.Auth;
using IttihadAlMullak.Infrastructure.Payments;
using IttihadAlMullak.Infrastructure.Persistence;
using IttihadAlMullak.Infrastructure.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IttihadAlMullak.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddSingleton<ITokenService, TokenService>();
        services.AddSingleton<IPasswordHasherService, PasswordHasherService>();
        services.AddSingleton<IFileStorage, LocalFileStorage>();
        services.AddSingleton<IPaymentGateway, MockPaymentGateway>(); // يتبدل بتنفيذ فوري/Paymob لاحقاً

        return services;
    }
}
