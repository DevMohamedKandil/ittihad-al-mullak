import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards';

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
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'apartments',
        loadComponent: () => import('./pages/admin/apartments/apartments').then((m) => m.ApartmentsPage),
      },
      {
        path: 'invoices',
        loadComponent: () => import('./pages/admin/invoices/invoices').then((m) => m.InvoicesPage),
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./pages/admin/maintenance/maintenance').then((m) => m.MaintenancePage),
      },
      {
        path: 'announcements',
        loadComponent: () => import('./pages/admin/announcements/announcements').then((m) => m.AnnouncementsPage),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/users/users').then((m) => m.UsersPage),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/admin/settings/settings').then((m) => m.SettingsPage),
      },
      {
        path: 'permissions',
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
