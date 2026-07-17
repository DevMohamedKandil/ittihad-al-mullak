import { Component } from '@angular/core';

/**
 * رسمة تعبيرية لعمارة سكنية مصرية — خزان مياه ودش استقبال على السطح، بلكونات، وشجرة نخيل،
 * عشان الصفحات الأولى (الهبوط، الدخول) تبقى ليها هوية بصرية حقيقية مش شكل SaaS عام.
 * الألوان بتتبع نفس متغيرات الثيم (primary/secondary/success/warning) فبتتكيف تلقائيًا مع الوضع الداكن.
 */
@Component({
  selector: 'app-building-illustration',
  template: `
    <svg viewBox="0 0 400 380" class="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="glow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.16" />
          <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="150" r="170" fill="url(#glow)" />

      <!-- الشمس -->
      <circle cx="320" cy="70" r="26" fill="var(--color-warning)" opacity="0.85" />

      <!-- شجرة نخيل -->
      <g transform="translate(70,205)">
        <path d="M10 130 C 4 90, 14 55, 20 20" fill="none" stroke="var(--color-secondary)" stroke-width="7" stroke-linecap="round" />
        <g fill="var(--color-success)">
          <ellipse cx="20" cy="16" rx="30" ry="10" transform="rotate(-20 20 16)" />
          <ellipse cx="20" cy="16" rx="30" ry="10" transform="rotate(15 20 16)" />
          <ellipse cx="20" cy="16" rx="28" ry="9" transform="rotate(-55 20 16)" />
          <ellipse cx="20" cy="16" rx="28" ry="9" transform="rotate(50 20 16)" />
          <ellipse cx="20" cy="16" rx="24" ry="8" transform="rotate(85 20 16)" />
        </g>
      </g>

      <!-- خط الأرض -->
      <rect x="0" y="335" width="400" height="6" fill="var(--color-border)" />

      <!-- خزان المياه ودش الاستقبال (سمة أسطح القاهرة) -->
      <g transform="translate(150,95)">
        <rect x="0" y="10" width="26" height="22" rx="3" fill="var(--color-muted-foreground)" opacity="0.55" />
        <ellipse cx="13" cy="10" rx="13" ry="4" fill="var(--color-muted-foreground)" opacity="0.7" />
      </g>
      <g transform="translate(230,90) rotate(-15)" stroke="var(--color-muted-foreground)" stroke-width="2.5" fill="none" opacity="0.65">
        <path d="M0 18 A 16 16 0 0 1 24 4" />
        <line x1="12" y1="11" x2="12" y2="-8" />
      </g>

      <!-- جسم العمارة -->
      <rect x="108" y="108" width="184" height="16" rx="2" fill="var(--color-primary)" />
      <rect x="115" y="124" width="170" height="211" fill="var(--color-card)" stroke="var(--color-border)" stroke-width="2" />

      <!-- الشرفات ونوافذ الأدوار -->
      @for (row of rows; track row) {
        <rect [attr.x]="115" [attr.y]="139 + row * 47" width="170" height="6" fill="var(--color-border)" opacity="0.6" />
        @for (col of cols; track col) {
          <rect
            [attr.x]="132 + col * 46"
            [attr.y]="150 + row * 47"
            width="34" height="28" rx="2"
            [attr.fill]="isLit(row, col) ? 'var(--color-warning)' : 'var(--color-muted)'"
            [attr.opacity]="isLit(row, col) ? 0.8 : 1"
          />
        }
      }

      <!-- المدخل -->
      <rect x="182" y="290" width="36" height="45" fill="var(--color-primary)" />
      <circle cx="211" cy="312" r="2.2" fill="var(--color-primary-foreground)" />
    </svg>
  `,
})
export class BuildingIllustration {
  protected readonly rows = [0, 1, 2, 3];
  protected readonly cols = [0, 1, 2];

  private readonly litWindows = new Set(['0-0', '0-2', '1-1', '2-0', '2-2', '3-1']);

  protected isLit(row: number, col: number): boolean {
    return this.litWindows.has(`${row}-${col}`);
  }
}
