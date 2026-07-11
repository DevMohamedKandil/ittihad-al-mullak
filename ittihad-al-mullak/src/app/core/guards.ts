import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { PermissionsService } from './permissions.service';
import { firstAccessibleAdminPath } from './admin-screens';

/** لازم يكون مسجل دخول — غير كده يتحول لصفحة تسجيل الدخول. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

/**
 * حماية شاشة إدارة معينة بمفتاح صلاحية ديناميكي جاي من الباك اند (RolePermissions)،
 * مش هارد كودد بالدور — يعني لو الأدمن دّى المالك أو المستأجر صلاحية "Dashboard.View"
 * من شاشة الصلاحيات، هو فعلاً يقدر يدخل شاشة الداشبورد دي في لوحة الإدارة.
 * الأدمن نفسه عنده كل الصلاحيات افتراضياً (PermissionSeeder) فمحدش هيأثر عليه.
 * لو معندوش صلاحية، بيتحول لأول شاشة إدارة هو فعلاً عنده صلاحية عليها، أو لصفحة المالك لو مفيش ولا واحدة.
 */
export function requirePermission(permissionKey: string): CanActivateFn {
  return async () => {
    const auth = inject(AuthService);
    const permissions = inject(PermissionsService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);

    await permissions.ensureLoaded();

    if (permissions.has(permissionKey)) return true;

    const fallback = firstAccessibleAdminPath(permissions);
    return router.createUrlTree(fallback !== null ? ['/admin', ...(fallback ? [fallback] : [])] : ['/owner']);
  };
}
