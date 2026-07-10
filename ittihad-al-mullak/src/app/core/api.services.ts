import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  API_URL,
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
    return this.http.get<DashboardStats>(`${API_URL}/dashboard/stats`);
  }
  collectionChart(): Observable<CollectionChart> {
    return this.http.get<CollectionChart>(`${API_URL}/dashboard/collection-chart`);
  }
}

@Injectable({ providedIn: 'root' })
export class ApartmentsApi {
  private readonly http = inject(HttpClient);
  list(search?: string): Observable<Apartment[]> {
    return this.http.get<Apartment[]>(`${API_URL}/apartments`, { params: params({ search }) });
  }
  create(body: { number: string; floor: number; ownerId?: number | null; tenantId?: number | null }): Observable<Apartment> {
    return this.http.post<Apartment>(`${API_URL}/apartments`, body);
  }
  update(id: number, body: Partial<{ number: string; floor: number; ownerId: number | null; tenantId: number | null }>): Observable<Apartment> {
    return this.http.put<Apartment>(`${API_URL}/apartments/${id}`, body);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/apartments/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class InvoicesApi {
  private readonly http = inject(HttpClient);
  list(filters: { status?: string; period?: string; search?: string; page?: number; pageSize?: number } = {}): Observable<Paged<Invoice>> {
    return this.http.get<Paged<Invoice>>(`${API_URL}/invoices`, { params: params(filters) });
  }
  summary(): Observable<InvoicesSummary> {
    return this.http.get<InvoicesSummary>(`${API_URL}/invoices/summary`);
  }
  /** apartmentId = null → إصدار جماعي لكل الشقق */
  create(body: { apartmentId: number | null; title: string; period: string; amount: number; dueDate: string; type: InvoiceType }): Observable<Invoice[]> {
    return this.http.post<Invoice[]>(`${API_URL}/invoices`, body);
  }
  pay(invoiceId: number, body: { amount: number; method: PaymentMethod; reference?: string }): Observable<Invoice> {
    return this.http.post<Invoice>(`${API_URL}/invoices/${invoiceId}/payments`, body);
  }
  sendReminders(): Observable<{ notifiedOwners: number }> {
    return this.http.post<{ notifiedOwners: number }>(`${API_URL}/invoices/reminders`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class ExpensesApi {
  private readonly http = inject(HttpClient);
  list(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${API_URL}/expenses`);
  }
  create(body: { title: string; amount: number; category: string; date?: string; notes?: string }): Observable<Expense> {
    return this.http.post<Expense>(`${API_URL}/expenses`, body);
  }
}

@Injectable({ providedIn: 'root' })
export class MaintenanceApi {
  private readonly http = inject(HttpClient);
  list(status?: MaintenanceStatus): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(`${API_URL}/maintenance`, { params: params({ status }) });
  }
  create(body: { title: string; description: string; category?: string; priority: MaintenancePriority; apartmentId?: number | null }): Observable<MaintenanceRequest> {
    return this.http.post<MaintenanceRequest>(`${API_URL}/maintenance`, body);
  }
  updateStatus(id: number, body: { status: MaintenanceStatus; assignedTo?: string; rejectionReason?: string }): Observable<MaintenanceRequest> {
    return this.http.patch<MaintenanceRequest>(`${API_URL}/maintenance/${id}/status`, body);
  }
}

@Injectable({ providedIn: 'root' })
export class AnnouncementsApi {
  private readonly http = inject(HttpClient);
  list(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${API_URL}/announcements`);
  }
  create(body: { title: string; content: string; type: AnnouncementType; isPinned: boolean; scheduledAt?: string | null }): Observable<Announcement> {
    return this.http.post<Announcement>(`${API_URL}/announcements`, body);
  }
  update(id: number, body: { title: string; content: string; type: AnnouncementType; isPinned: boolean; scheduledAt?: string | null }): Observable<Announcement> {
    return this.http.put<Announcement>(`${API_URL}/announcements/${id}`, body);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/announcements/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly http = inject(HttpClient);
  list(filters: { role?: UserRole; search?: string } = {}): Observable<UserListItem[]> {
    return this.http.get<UserListItem[]>(`${API_URL}/users`, { params: params(filters) });
  }
  create(body: { name: string; phone: string; email?: string; password: string; role: UserRole; apartmentId?: number | null }): Observable<UserListItem> {
    return this.http.post<UserListItem>(`${API_URL}/users`, body);
  }
  update(id: number, body: Partial<{ name: string; email: string; isActive: boolean }>): Observable<UserListItem> {
    return this.http.put<UserListItem>(`${API_URL}/users/${id}`, body);
  }
}

@Injectable({ providedIn: 'root' })
export class SettingsApi {
  private readonly http = inject(HttpClient);
  get(): Observable<BuildingSettings> {
    return this.http.get<BuildingSettings>(`${API_URL}/settings`);
  }
  update(body: Omit<BuildingSettings, 'id' | 'code'>): Observable<BuildingSettings> {
    return this.http.put<BuildingSettings>(`${API_URL}/settings`, body);
  }
}

@Injectable({ providedIn: 'root' })
export class OwnerApi {
  private readonly http = inject(HttpClient);
  summary(): Observable<OwnerSummary> {
    return this.http.get<OwnerSummary>(`${API_URL}/owner/summary`);
  }
  bills(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${API_URL}/owner/bills`);
  }
  maintenance(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(`${API_URL}/owner/maintenance`);
  }
}

@Injectable({ providedIn: 'root' })
export class ConversationsApi {
  private readonly http = inject(HttpClient);
  mine(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${API_URL}/conversations`);
  }
  /** participantUserId = null → محادثة مع الإدارة */
  start(participantUserId: number | null = null): Observable<Conversation> {
    return this.http.post<Conversation>(`${API_URL}/conversations`, { participantUserId });
  }
  messages(conversationId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${API_URL}/conversations/${conversationId}/messages`);
  }
  send(conversationId: number, content: string): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${API_URL}/conversations/${conversationId}/messages`, { content });
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
  private readonly http = inject(HttpClient);
  mine(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${API_URL}/notifications`);
  }
  markRead(id: number): Observable<void> {
    return this.http.post<void>(`${API_URL}/notifications/${id}/read`, {});
  }
  markAllRead(): Observable<void> {
    return this.http.post<void>(`${API_URL}/notifications/read-all`, {});
  }
}
