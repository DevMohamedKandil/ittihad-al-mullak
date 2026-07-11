import { Routes } from '@angular/router';
import { authGuard, requirePermission } from './core/guards';
import { ADMIN_SCREEN_PERMISSIONS } from './core/admin-screens';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        canActivate: [requirePermission(ADMIN_SCREEN_PERMISSIONS[''])],
        loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'apartments',
        canActivate: [requirePermission(ADMIN_SCREEN_PERMISSIONS['apartments'])],
        loadComponent: () => import('./pages/admin/apartments/apartments').then((m) => m.ApartmentsPage),
      },
      {
        path: 'invoices',
        canActivate: [requirePermission(ADMIN_SCREEN_PERMISSIONS['invoices'])],
        loadComponent: () => import('./pages/admin/invoices/invoices').then((m) => m.InvoicesPage),
      },
      {
        path: 'maintenance',
        canActivate: [requirePermission(ADMIN_SCREEN_PERMISSIONS['maintenance'])],
        loadComponent: () => import('./pages/admin/maintenance/maintenance').then((m) => m.MaintenancePage),
      },
      {
        path: 'announcements',
        canActivate: [requirePermission(ADMIN_SCREEN_PERMISSIONS['announcements'])],
        loadComponent: () => import('./pages/admin/announcements/announcements').then((m) => m.AnnouncementsPage),
      },
      {
        path: 'users',
        canActivate: [requirePermission(ADMIN_SCREEN_PERMISSIONS['users'])],
        loadComponent: () => import('./pages/admin/users/users').then((m) => m.UsersPage),
      },
      {
        path: 'settings',
        canActivate: [requirePermission(ADMIN_SCREEN_PERMISSIONS['settings'])],
        loadComponent: () => import('./pages/admin/settings/settings').then((m) => m.SettingsPage),
      },
      {
        path: 'permissions',
        canActivate: [requirePermission(ADMIN_SCREEN_PERMISSIONS['permissions'])],
        loadComponent: () => import('./pages/admin/permissions/permissions').then((m) => m.PermissionsPage),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  {
    path: 'owner',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/owner/owner-layout').then((m) => m.OwnerLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/owner/home/home').then((m) => m.OwnerHome),
      },
      {
        path: 'bills',
        loadComponent: () => import('./pages/owner/bills/bills').then((m) => m.OwnerBills),
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./pages/owner/maintenance/maintenance').then((m) => m.OwnerMaintenance),
      },
      {
        path: 'messages',
        loadComponent: () => import('./pages/owner/messages/messages').then((m) => m.OwnerMessages),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/owner/profile/profile').then((m) => m.OwnerProfile),
      },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];
