import { Component, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

/**
 * حالة "لا توجد بيانات" موحّدة لكل الصفحة — أيقونة في دايرة ملوّنة + عنوان + سطر توضيحي اختياري،
 * بدل نص عادي "لا توجد بيانات" في كل مكان بشكل مختلف.
 */
@Component({
  selector: 'app-empty-state',
  imports: [LucideAngularModule],
  template: `
    <div class="flex flex-col items-center justify-center text-center py-12 px-6">
      <div class="flex items-center justify-center w-16 h-16 rounded-2xl mb-4" [class]="iconBg()">
        <lucide-angular [img]="icon()" [size]="28" [class]="iconClass()" />
      </div>
      <p class="font-medium">{{ title() }}</p>
      @if (hint()) {
        <p class="text-sm text-muted-foreground mt-1 max-w-xs">{{ hint() }}</p>
      }
    </div>
  `,
})
export class EmptyState {
  readonly icon = input.required<LucideIconData>();
  readonly title = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly iconBg = input('bg-muted');
  readonly iconClass = input('text-muted-foreground');
}
