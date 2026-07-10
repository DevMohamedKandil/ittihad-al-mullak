import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { PermissionsService } from './permissions.service';

/**
 * إظهار العنصر فقط لو المستخدم معاه الصلاحية:
 *   <button *hasPermission="'Invoices.Create'">إنشاء فاتورة</button>
 */
@Directive({ selector: '[hasPermission]' })
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly permissions = inject(PermissionsService);

  readonly hasPermission = input.required<string>();

  private visible = false;

  constructor() {
    effect(() => {
      const allowed = this.permissions.all().has(this.hasPermission());
      if (allowed && !this.visible) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.visible = true;
      } else if (!allowed && this.visible) {
        this.viewContainer.clear();
        this.visible = false;
      }
    });
  }
}
