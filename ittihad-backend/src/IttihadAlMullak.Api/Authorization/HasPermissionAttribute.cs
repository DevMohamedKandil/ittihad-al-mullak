using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace IttihadAlMullak.Api.Authorization;

/// <summary>
/// ربط الـ endpoint بصلاحية من مصفوفة الصلاحيات: [HasPermission("Invoices.Create")]
/// الفرق عن نظام Afzaz: مفتاح الصلاحية ثابت في السيرفر — مش بيتقرا من headers العميل.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class HasPermissionAttribute(string permissionKey) : AuthorizeAttribute(PolicyPrefix + permissionKey)
{
    public const string PolicyPrefix = "perm:";
}

public class PermissionRequirement(string permissionKey) : IAuthorizationRequirement
{
    public string PermissionKey { get; } = permissionKey;
}

/// <summary>بيتحقق من الصلاحية من قاعدة البيانات (بكاش) حسب دور المستخدم الحالي.</summary>
public class PermissionAuthorizationHandler(IServiceScopeFactory scopeFactory)
    : AuthorizationHandler<PermissionRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        using var scope = scopeFactory.CreateScope();
        var currentUser = scope.ServiceProvider.GetRequiredService<ICurrentUser>();
        var permissions = scope.ServiceProvider.GetRequiredService<IPermissionService>();

        if (await permissions.HasPermissionAsync(currentUser.Role, requirement.PermissionKey))
            context.Succeed(requirement);
    }
}

/// <summary>بيولّد Policy لأي مفتاح صلاحية تلقائياً من غير تسجيل يدوي لكل واحدة.</summary>
public class PermissionPolicyProvider(IOptions<AuthorizationOptions> options) : IAuthorizationPolicyProvider
{
    private readonly DefaultAuthorizationPolicyProvider _fallback = new(options);

    public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => _fallback.GetDefaultPolicyAsync();

    public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => _fallback.GetFallbackPolicyAsync();

    public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        if (policyName.StartsWith(HasPermissionAttribute.PolicyPrefix, StringComparison.OrdinalIgnoreCase))
        {
            var key = policyName[HasPermissionAttribute.PolicyPrefix.Length..];
            var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .AddRequirements(new PermissionRequirement(key))
                .Build();
            return Task.FromResult<AuthorizationPolicy?>(policy);
        }
        return _fallback.GetPolicyAsync(policyName);
    }
}
