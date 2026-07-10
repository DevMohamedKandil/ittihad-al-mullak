import { TranslationKey } from './ar';

// English translations — every key from ar.ts must exist here
export const EN: Record<TranslationKey, string> = {
  'app.name': 'Ittihad Al-Mullak',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.add': 'Add',
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.search': 'Search...',
  'common.viewAll': 'View all',
  'common.loading': 'Loading...',
  'common.noData': 'No data',
  'common.error': 'Failed to load data',
  'common.logout': 'Logout',
  'common.login': 'Login',
  'common.egp': 'EGP',

  'role.Admin': 'Committee Head',
  'role.Owner': 'Owner',
  'role.Tenant': 'Tenant',

  'payment.paid': 'Paid',
  'payment.partial': 'Partial',
  'payment.unpaid': 'Unpaid',
  'payment.overdue': 'Overdue',
  'payment.payNow': 'Pay now',

  'method.Cash': 'Cash',
  'method.Fawry': 'Fawry',
  'method.Card': 'Card',
  'method.BankTransfer': 'Bank transfer',

  'maintenance.Pending': 'Pending',
  'maintenance.InProgress': 'In progress',
  'maintenance.Completed': 'Completed',
  'maintenance.Rejected': 'Rejected',
  'priority.Low': 'Low',
  'priority.Medium': 'Medium',
  'priority.High': 'High',

  'announcement.General': 'General',
  'announcement.Urgent': 'Urgent',
  'announcement.Financial': 'Financial',

  'nav.dashboard': 'Dashboard',
  'nav.apartments': 'Apartments',
  'nav.invoices': 'Invoices',
  'nav.maintenance': 'Maintenance',
  'nav.announcements': 'Announcements',
  'nav.users': 'Users',
  'nav.settings': 'Settings',
  'nav.home': 'Home',
  'nav.messages': 'Messages',
  'nav.profile': 'Profile',
};
