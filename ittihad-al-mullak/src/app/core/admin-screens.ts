import { PermissionsService } from './permissions.service';

/** خريطة شاشات لوحة الإدارة إلى مفتاح الصلاحية بتاعها في جدول RolePermissions (نفس ترتيب PermissionSeeder). */
export const ADMIN_SCREEN_PERMISSIONS: Record<string, string> = {
  '': 'Dashboard.View',
  apartments: 'Apartments.View',
  invoices: 'Invoices.View',
  maintenance: 'Maintenance.View',
  announcements: 'Announcements.View',
  users: 'Users.View',
  settings: 'Settings.View',
  permissions: 'Permissions.View',
};

/** هل عند المستخدم صلاحية View على أي شاشة إدارة على الأقل؟ */
export function hasAnyAdminAccess(permissions: PermissionsService): boolean {
  return Object.values(ADMIN_SCREEN_PERMISSIONS).some((key) => permissions.has(key));
}

/** أول شاشة إدارة عنده صلاحية يشوفها (مسار نسبي فاضي = /admin نفسها) — أو null لو مفيش ولا واحدة. */
export function firstAccessibleAdminPath(permissions: PermissionsService): string | null {
  for (const [path, key] of Object.entries(ADMIN_SCREEN_PERMISSIONS)) {
    if (permissions.has(key)) return path;
  }
  return null;
}
