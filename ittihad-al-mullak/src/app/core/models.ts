// عقود البيانات — مطابقة لـ DTOs الباك اند (IttihadAlMullak.Application/Dtos)

export const API_URL = 'http://localhost:5301/api/v1';

export type UserRole = 'Admin' | 'Owner' | 'Tenant';
export type InvoiceType = 'Monthly' | 'Maintenance' | 'Special';
export type PaymentMethod = 'Cash' | 'Fawry' | 'Card' | 'BankTransfer';
export type MaintenanceStatus = 'Pending' | 'InProgress' | 'Completed' | 'Rejected';
export type MaintenancePriority = 'Low' | 'Medium' | 'High';
export type AnnouncementType = 'General' | 'Urgent' | 'Financial';
export type PaymentStatusString = 'paid' | 'partial' | 'unpaid' | 'overdue';

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  role: UserRole;
  isActive: boolean;
  buildingId: number | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface BuildingSummary {
  id: number;
  code: string;
  name: string;
}

export interface CreateBuildingRequest {
  name: string;
  address: string;
  floorsCount: number;
  apartmentsCount: number;
  monthlySubscription: number;
  dueDay: number;
  phone: string | null;
  whatsApp: string | null;
  email: string | null;
}

export interface DashboardStats {
  collectionRate: number;
  totalExpenses: number;
  maintenanceCount: number;
  newMaintenanceCount: number;
  residentsCount: number;
  apartmentsCount: number;
}

export interface MonthlyCollection {
  month: string;
  collected: number;
  target: number;
}

export interface CollectionChart {
  monthly: MonthlyCollection[];
  paymentStatus: { paid: number; partial: number; unpaid: number };
}

export interface Apartment {
  id: number;
  number: string;
  floor: number;
  ownerId: number | null;
  ownerName: string | null;
  ownerPhone: string | null;
  tenantId: number | null;
  tenantName: string | null;
  residentType: 'owner' | 'tenant';
  paymentStatus: PaymentStatusString;
  dueAmount: number;
}

export interface Invoice {
  id: number;
  number: string;
  apartmentId: number;
  apartmentNumber: string;
  ownerName: string | null;
  title: string;
  period: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  type: InvoiceType;
  status: PaymentStatusString;
  createdAt: string;
}

export interface InvoicesSummary {
  totalCount: number;
  totalAmount: number;
  collectedAmount: number;
  overdueAmount: number;
  collectionRate: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  category: string | null;
  apartmentLabel: string;
  requesterId: number;
  requesterName: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  assignedTo: string | null;
  rejectionReason: string | null;
  photos: string[];
  createdAt: string;
  resolvedAt: string | null;
}

/** أساس روابط الملفات المرفوعة (صور الصيانة) */
export const FILES_BASE_URL = 'http://localhost:5301';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: AnnouncementType;
  isPinned: boolean;
  createdByName: string;
  scheduledAt: string | null;
  createdAt: string;
}

export interface UserListItem {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  role: UserRole;
  isActive: boolean;
  apartmentNumber: string | null;
  createdAt: string;
}

export interface BuildingSettings {
  id: number;
  code: string;
  name: string;
  address: string;
  floorsCount: number;
  apartmentsCount: number;
  monthlySubscription: number;
  dueDay: number;
  phone: string | null;
  whatsApp: string | null;
  email: string | null;
}

export interface OwnerSummary {
  name: string;
  apartmentNumber: string | null;
  floor: number | null;
  buildingName: string;
  buildingAddress: string;
  dueAmount: number;
  lastPaymentDate: string | null;
  activeMaintenanceCount: number;
  newAnnouncementsCount: number;
  pendingBills: Invoice[];
  latestAnnouncements: Announcement[];
}

export interface Conversation {
  id: number;
  name: string;
  isGroup: boolean;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  mine: boolean;
}

export interface AppNotification {
  id: number;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string | null;
}
