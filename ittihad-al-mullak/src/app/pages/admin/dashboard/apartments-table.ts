import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  MoreVertical,
  Eye,
  Receipt,
  MessageSquare,
  Phone,
} from 'lucide-angular';
import { ApartmentsApi } from '../../../core/api.services';
import { Apartment } from '../../../core/models';
import { formatCurrency } from '../../../core/format';

@Component({
  selector: 'app-apartments-table',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './apartments-table.html',
})
export class ApartmentsTable implements OnInit {
  private readonly apartmentsApi = inject(ApartmentsApi);

  protected readonly icons = {
    search: Search,
    moreVertical: MoreVertical,
    eye: Eye,
    receipt: Receipt,
    messageSquare: MessageSquare,
    phone: Phone,
  };

  protected readonly search = signal('');
  protected readonly openMenuId = signal<number | null>(null);
  protected readonly apartments = signal<Apartment[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly statusConfig = {
    paid: { label: 'مدفوع', class: 'border-transparent bg-success text-success-foreground' },
    partial: { label: 'جزئي', class: 'border-transparent bg-warning text-warning-foreground' },
    unpaid: { label: 'غير مدفوع', class: 'border-transparent bg-destructive text-destructive-foreground' },
    overdue: { label: 'متأخر', class: 'border-transparent bg-destructive text-destructive-foreground' },
  };

  ngOnInit(): void {
    this.load();
  }

  protected onSearchChange(value: string): void {
    this.search.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.load(), 300);
  }

  protected formatDue(amount: number): string {
    return amount > 0 ? formatCurrency(amount) : '-';
  }

  protected toggleMenu(id: number) {
    this.openMenuId.update((open) => (open === id ? null : id));
  }

  protected closeMenu() {
    this.openMenuId.set(null);
  }

  private load(): void {
    this.loading.set(true);
    this.apartmentsApi.list(this.search()).subscribe({
      next: (items) => {
        this.apartments.set(items);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? 'تعذر تحميل البيانات');
        this.loading.set(false);
      },
    });
  }
}
