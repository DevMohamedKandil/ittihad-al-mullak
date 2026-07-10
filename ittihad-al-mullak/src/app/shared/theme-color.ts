// يحوّل متغير CSS من الثيم (oklch) للون hex/rgba مفهوم للـ canvas
export function themeColor(varName: string, alpha = 1): string {
  const el = document.createElement('div');
  el.style.color = `var(${varName})`;
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color;
  el.remove();
  // إسناد اللون لـ canvas وقراءته تاني بيرجّعه بصيغة hex موحّدة (#rrggbb)
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = computed;
  const hex = String(ctx.fillStyle);
  if (alpha === 1 || !hex.startsWith('#')) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
