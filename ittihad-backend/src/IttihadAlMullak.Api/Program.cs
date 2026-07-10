using System.Text;
using System.Text.Json.Serialization;
using IttihadAlMullak.Api.Middleware;
using IttihadAlMullak.Api.Services;
using IttihadAlMullak.Application;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Infrastructure;
using IttihadAlMullak.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// الطبقات: Application (البيزنس) + Infrastructure (قاعدة البيانات والتوكن)
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();

builder.Services.AddControllers().AddJsonOptions(options =>
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// JWT Bearer
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ClockSkew = TimeSpan.FromMinutes(1),
        };
    });
builder.Services.AddAuthorization();

// CORS: الويب (ng serve) + الموبايل (Capacitor)
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy => policy
    .WithOrigins(
        "http://localhost:4200",
        "http://localhost:4300",
        "capacitor://localhost",
        "http://localhost",
        "https://localhost")
    .AllowAnyHeader()
    .AllowAnyMethod()));

// Swagger + زرار Authorize لإدخال التوكن
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Ittihad Al-Mullak API",
        Version = "v1",
        Description = "API إدارة العمارات السكنية — اتحاد الملاك",
    });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "اكتب التوكن فقط (بدون كلمة Bearer)",
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
            },
            Array.Empty<string>()
        },
    });
});

var app = builder.Build();

// الترجمة: العربي افتراضي، والإنجليزي عبر هيدر Accept-Language: en
// رسائل الأخطاء بتتقرا من كتالوج Msg في طبقة Application حسب لغة الطلب
var supportedCultures = new[] { "ar", "en" };
app.UseRequestLocalization(options =>
{
    options.SetDefaultCulture("ar");
    options.AddSupportedCultures(supportedCultures);
    options.AddSupportedUICultures(supportedCultures);
});

// تطبيق الـ Migrations + الـ Seed تلقائياً عند التشغيل
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db, scope.ServiceProvider.GetRequiredService<IPasswordHasherService>());

    // DbUp: تنفيذ سكريبتات SQL اليدوية من فولدر SqlScripts (مرة واحدة لكل سكريبت)
    SqlScriptRunner.Run(
        builder.Configuration.GetConnectionString("Default")!,
        Path.Combine(app.Environment.ContentRootPath, "SqlScripts"),
        app.Logger);
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Ittihad Al-Mullak v1");
    options.RoutePrefix = "api/docs";
});
app.UseStaticFiles(); // خدمة صور الصيانة المرفوعة من wwwroot/uploads
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
