import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Building2, ChevronDown, Plus, Check, X } from 'lucide-angular';
import { AuthService } from '../../core/auth.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { BuildingSummary } from '../../core/models';

/** مبدّل العمارة النشطة — بيظهر في سايدبار الإدارة، وبيسمح بإنشاء عمارة جديدة لنفس حساب الأدمن. */
@Component({
  selector: 'app-building-switcher',
  imports: [FormsModule, LucideAngularModule, TranslatePipe],
  templateUrl: './building-switcher.html',
})
export class BuildingSwitcher {
  private readonly auth = inject(AuthService);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = { building2: Building2, chevronDown: ChevronDown, plus: Plus, check: Check, x: X };

  protected readonly buildings = signal<BuildingSummary[]>([]);
  protected readonly isOpen = signal(false);
  protected readonly showCreateModal = signal(false);
  protected readonly creating = signal(false);
  protected readonly createError = signal<string | null>(null);

  protected readonly isAdmin = computed(() => this.auth.isAdmin());
  protected readonly currentBuildingId = computed(() => this.auth.currentUser()?.buildingId ?? null);
  protected readonly currentBuildingName = computed(
    () => this.buildings().find((b) => b.id === this.currentBuildingId())?.name ?? '',
  );
  protected readonly canSwitch = computed(() => this.buildings().length > 1 || this.isAdmin());

  protected readonly name = signal('');
  protected readonly address = signal('');
  protected readonly floorsCount = signal(1);
  protected readonly apartmentsCount = signal(1);
  protected readonly monthlySubscription = signal(0);
  protected readonly dueDay = signal(15);

  constructor() {
    this.load();
  }

  private load(): void {
    this.auth.myBuildings().subscribe((list) => this.buildings.set(list));
  }

  protected toggle(): void {
    if (!this.canSwitch()) return;
    this.isOpen.update((open) => !open);
  }

  protected select(building: BuildingSummary): void {
    this.isOpen.set(false);
    if (building.id === this.currentBuildingId()) return;
    this.auth.switchBuilding(building.id);
  }

  protected openCreate(): void {
    this.isOpen.set(false);
    this.name.set('');
    this.address.set('');
    this.floorsCount.set(1);
    this.apartmentsCount.set(1);
    this.monthlySubscription.set(0);
    this.dueDay.set(15);
    this.createError.set(null);
    this.showCreateModal.set(true);
  }

  protected closeCreate(): void {
    if (this.creating()) return;
    this.showCreateModal.set(false);
  }

  protected submitCreate(): void {
    if (!this.name().trim() || !this.address().trim() || this.creating()) return;
    this.creating.set(true);
    this.createError.set(null);
    this.auth
      .createBuilding({
        name: this.name().trim(),
        address: this.address().trim(),
        floorsCount: this.floorsCount(),
        apartmentsCount: this.apartmentsCount(),
        monthlySubscription: this.monthlySubscription(),
        dueDay: this.dueDay(),
        phone: null,
        whatsApp: null,
        email: null,
      })
      .subscribe({
        error: (err) => {
          this.createError.set(err.error?.title ?? this.i18n.t('common.error'));
          this.creating.set(false);
        },
      });
  }
}
