import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Announcement,
  AnnouncementType,
  Apartment,
  AppNotification,
  BuildingSettings,
  ChatMessage,
  CollectionChart,
  Conversation,
  DashboardStats,
  Expense,
  Invoice,
  InvoiceType,
  InvoicesSummary,
  MaintenancePriority,
  MaintenanceRequest,
  MaintenanceStatus,
  Paged,
  PaymentMethod,
  OwnerSummary,
  UserListItem,
  UserRole,
} from './models';
import { APP_CONFIG } from './app-config';

function params(values: Record<string, string | number | null | undefined>): HttpParams {
  let result = new HttpParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== null && value !== undefined && value !== '') result = result.set(key, value);
  }
  return result;
}

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly http = inject(HttpClient);
  stats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${APP_CONFIG.apiUrl}/dashboard/stats`);
  }
  collectionChart(): Observable<CollectionChart> {
    return this.http.get<CollectionChart>(`${APP_CONFIG.apiUrl}/dashboard/collection-chart`);
  }
}

@Injectable({ providedIn: 'root' })
export class ApartmentsApi {
  private readonly http = inject(HttpClient);
  list(search?: string): Observable<Apartment[]> {
    return this.http.get<Apartment[]>(`${APP_CONFIG.apiUrl}/apartments`, { params: params({ search }) });
  }
  create(body: { number: string; floor: number; ownerId?: number | null; tenantId?: number | null }): Observable<Apartment> {
    return this.http.post<Apartment>(`${APP_CONFIG.apiUrl}/apartments`, body);
  }
  update(id: number, body: Partial<{ number: string; floor: number; ownerId: number | null; tenantId: number | null }>): Observable<Apartment> {
    return this.http.put<Apartment>(`${APP_CONFIG.apiUrl}/apartments/${id}`, body);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${APP_CONFIG.apiUrl}/apartments/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class InvoicesApi {
  private readonly http = inject(HttpClient);
  list(filters: { status?: string; period?: string; search?: string; page?: number; pageSize?: number } = {}): Observable<Paged<Invoice>> {
    return this.http.get<Paged<Invoice>>(`${APP_CONFIG.apiUrl}/invoices`, { params: params(filters) });
  }
  summary(): Observable<InvoicesSummary> {
    return this.http.get<InvoicesSummary>(`${APP_CONFIG.apiUrl}/invoices/summary`);
  }
  /** apartmentId = null → إصدار جماعي لكل الشقق */
  create(body: { apartmentId: number | null; title: string; period: string; amount: number; dueDate: string; type: InvoiceType }): Observable<Invoice[]> {
    return this.http.post<Invoice[]>(`${APP_CONFIG.apiUrl}/invoices`, body);
  }
  pay(invoiceId: number, body: { amount: number; method: PaymentMethod; reference?: string }): Observable<Invoice> {
    return this.http.post<Invoice>(`${APP_CONFIG.apiUrl}/invoices/${invoiceId}/payments`, body);
  }
  sendReminders(): Observable<{ notifiedOwners: number }> {
    return this.http.post<{ notifiedOwners: number }>(`${APP_CONFIG.apiUrl}/invoices/reminders`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class ExpensesApi {
  private readonly http = inject(HttpClient);
  list(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${APP_CONFIG.apiUrl}/expenses`);
  }
  create(body: { title: string; amount: number; category: string; date?: string; notes?: string }): Observable<Expense> {
    return this.http.post<Expense>(`${APP_CONFIG.apiUrl}/expenses`, body);
  }
}

@Injectable({ providedIn: 'root' })
export class MaintenanceApi {
  private readonly http = inject(HttpClient);
  list(status?: MaintenanceStatus): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(`${APP_CONFIG.apiUrl}/maintenance`, { params: params({ status }) });
  }
  create(body: { title: string; description: string; category?: string; priority: MaintenancePriority; apartmentId?: number | null }): Observable<MaintenanceRequest> {
    return this.http.post<MaintenanceRequest>(`${APP_CONFIG.apiUrl}/maintenance`, body);
  }
  updateStatus(id: number, body: { status: MaintenanceStatus; assignedTo?: string; rejectionReason?: string }): Observable<MaintenanceRequest> {
    return this.http.patch<MaintenanceRequest>(`${APP_CONFIG.apiUrl}/maintenance/${id}/status`, body);
  }
  uploadPhoto(id: number, file: File): Observable<MaintenanceRequest> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<MaintenanceRequest>(`${APP_CONFIG.apiUrl}/maintenance/${id}/photos`, form);
  }
}

@Injectable({ providedIn: 'root' })
export class AnnouncementsApi {
  private readonly http = inject(HttpClient);
  list(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${APP_CONFIG.apiUrl}/announcements`);
  }
  create(body: { title: string; content: string; type: AnnouncementType; isPinned: boolean; scheduledAt?: string | null }): Observable<Announcement> {
    return this.http.post<Announcement>(`${APP_CONFIG.apiUrl}/announcements`, body);
  }
  update(id: number, body: { title: string; content: string; type: AnnouncementType; isPinned: boolean; scheduledAt?: string | null }): Observable<Announcement> {
    return this.http.put<Announcement>(`${APP_CONFIG.apiUrl}/announcements/${id}`, body);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${APP_CONFIG.apiUrl}/announcements/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly http = inject(HttpClient);
  list(filters: { role?: UserRole; search?: string } = {}): Observable<UserListItem[]> {
    return this.http.get<UserListItem[]>(`${APP_CONFIG.apiUrl}/users`, { params: params(filters) });
  }
  create(body: { name: string; phone: string; email?: string; password: string; role: UserRole; apartmentId?: number | null }): Observable<UserListItem> {
    return this.http.post<UserListItem>(`${APP_CONFIG.apiUrl}/users`, body);
  }
  update(id: number, body: Partial<{ name: string; email: string; isActive: boolean }>): Observable<UserListItem> {
    return this.http.put<UserListItem>(`${APP_CONFIG.apiUrl}/users/${id}`, body);
  }
}

@Injectable({ providedIn: 'root' })
export class SettingsApi {
  private readonly http = inject(HttpClient);
  get(): Observable<BuildingSettings> {
    return this.http.get<BuildingSettings>(`${APP_CONFIG.apiUrl}/settings`);
  }
  update(body: Omit<BuildingSettings, 'id' | 'code'>): Observable<BuildingSettings> {
    return this.http.put<BuildingSettings>(`${APP_CONFIG.apiUrl}/settings`, body);
  }
}

@Injectable({ providedIn: 'root' })
export class OwnerApi {
  private readonly http = inject(HttpClient);
  summary(): Observable<OwnerSummary> {
    return this.http.get<OwnerSummary>(`${APP_CONFIG.apiUrl}/owner/summary`);
  }
  bills(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${APP_CONFIG.apiUrl}/owner/bills`);
  }
  maintenance(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(`${APP_CONFIG.apiUrl}/owner/maintenance`);
  }
}

@Injectable({ providedIn: 'root' })
export class ConversationsApi {
  private readonly http = inject(HttpClient);
  mine(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${APP_CONFIG.apiUrl}/conversations`);
  }
  /** participantUserId = null → محادثة مع الإدارة */
  start(participantUserId: number | null = null): Observable<Conversation> {
    return this.http.post<Conversation>(`${APP_CONFIG.apiUrl}/conversations`, { participantUserId });
  }
  messages(conversationId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${APP_CONFIG.apiUrl}/conversations/${conversationId}/messages`);
  }
  send(conversationId: number, content: string): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${APP_CONFIG.apiUrl}/conversations/${conversationId}/messages`, { content });
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
  private readonly http = inject(HttpClient);
  mine(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${APP_CONFIG.apiUrl}/notifications`);
  }
  markRead(id: number): Observable<void> {
    return this.http.post<void>(`${APP_CONFIG.apiUrl}/notifications/${id}/read`, {});
  }
  markAllRead(): Observable<void> {
    return this.http.post<void>(`${APP_CONFIG.apiUrl}/notifications/read-all`, {});
  }
}

export interface PermissionScreen { id: number; key: string; nameAr: string; nameEn: string; sortOrder: number }
export interface PermissionAction { id: number; key: string; nameAr: string; nameEn: string }
export interface PermissionMatrixCell { screenId: number; actionId: number; admin: boolean; owner: boolean; tenant: boolean }
export interface PermissionMatrix { screens: PermissionScreen[]; actions: PermissionAction[]; cells: PermissionMatrixCell[] }

@Injectable({ providedIn: 'root' })
export class PermissionsApi {
  private readonly http = inject(HttpClient);
  matrix(): Observable<PermissionMatrix> {
    return this.http.get<PermissionMatrix>(`${APP_CONFIG.apiUrl}/permissions/matrix`);
  }
  update(body: { role: UserRole; screenId: number; actionId: number; granted: boolean }): Observable<void> {
    return this.http.put<void>(`${APP_CONFIG.apiUrl}/permissions`, body);
  }
}
