import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, Shield, RefreshCw } from 'lucide-angular';
import {
  PermissionMatrix,
  PermissionMatrixCell,
  PermissionScreen,
  PermissionAction,
  PermissionsApi,
} from '../../../core/api.services';
import { UserRole } from '../../../core/models';
import { TranslationService } from '../../../core/i18n/translation.service';

@Component({
  selector: 'app-permissions-page',
  imports: [LucideAngularModule, TranslatePipe],
  templateUrl: './permissions.html',
})
export class PermissionsPage {
  private readonly api = inject(PermissionsApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly icons = { shield: Shield, refresh: RefreshCw };

  protected readonly matrix = signal<PermissionMatrix | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly activeRole = signal<UserRole>('Owner');

  protected readonly roles: { value: UserRole; label: string }[] = [
    { value: 'Admin', label: this.i18n.t('role.Admin') },
    { value: 'Owner', label: this.i18n.t('role.Owner') },
    { value: 'Tenant', label: this.i18n.t('role.Tenant') },
  ];

  /** أسماء الشاشات والأكشنز جايه من السيرفر بالعربي والإنجليزي معاً */
  protected screenName(screen: PermissionScreen): string {
    return this.i18n.isEnglish() ? screen.nameEn : screen.nameAr;
  }

  protected actionName(action: PermissionAction): string {
    return this.i18n.isEnglish() ? action.nameEn : action.nameAr;
  }

  protected readonly cellsByScreen = computed(() => {
    const matrix = this.matrix();
    if (!matrix) return new Map<number, PermissionMatrixCell[]>();
    const map = new Map<number, PermissionMatrixCell[]>();
    for (const screen of matrix.screens) {
      map.set(screen.id, matrix.cells.filter((c) => c.screenId === screen.id));
    }
    return map;
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.matrix().subscribe({
      next: (matrix) => {
        this.matrix.set(matrix);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
        this.loading.set(false);
      },
    });
  }

  protected isGranted(cell: PermissionMatrixCell): boolean {
    switch (this.activeRole()) {
      case 'Admin': return cell.admin;
      case 'Owner': return cell.owner;
      default: return cell.tenant;
    }
  }

  protected toggle(cell: PermissionMatrixCell): void {
    if (this.saving()) return;
    const role = this.activeRole();
    const granted = !this.isGranted(cell);

    this.saving.set(true);
    this.api.update({ role, screenId: cell.screenId, actionId: cell.actionId, granted }).subscribe({
      next: () => {
        // تحديث الخلية محلياً من غير إعادة تحميل
        this.matrix.update((matrix) => {
          if (!matrix) return matrix;
          const cells = matrix.cells.map((c) =>
            c.screenId === cell.screenId && c.actionId === cell.actionId
              ? {
                  ...c,
                  admin: role === 'Admin' ? granted : c.admin,
                  owner: role === 'Owner' ? granted : c.owner,
                  tenant: role === 'Tenant' ? granted : c.tenant,
                }
              : c,
          );
          return { ...matrix, cells };
        });
        this.saving.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('permissionsAdmin.saveFailed'));
        this.saving.set(false);
      },
    });
  }
}
