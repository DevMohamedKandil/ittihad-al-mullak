import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  DoughnutController,
  ArcElement,
} from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, TrendingUp, PieChart } from 'lucide-angular';
import { themeColor } from '../../../shared/theme-color';
import { DashboardApi } from '../../../core/api.services';
import { MonthlyCollection } from '../../../core/models';
import { TranslationService } from '../../../core/i18n/translation.service';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  DoughnutController,
  ArcElement,
);

@Component({
  selector: 'app-collection-chart',
  imports: [TranslatePipe, LucideAngularModule],
  templateUrl: './collection-chart.html',
})
export class CollectionChart implements AfterViewInit, OnDestroy {
  private readonly dashboardApi = inject(DashboardApi);
  protected readonly i18n = inject(TranslationService);

  protected readonly trendingUpIcon = TrendingUp;
  protected readonly pieChartIcon = PieChart;

  private readonly areaCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('areaCanvas');
  private readonly pieCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('pieCanvas');

  private areaChart?: Chart;
  private pieChart?: Chart;

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly paymentStatusData = signal<{ name: string; value: number; color: string }[]>([]);
  protected readonly totalUnits = signal(0);

  ngAfterViewInit(): void {
    this.dashboardApi.collectionChart().subscribe({
      next: (data) => {
        const { paid, partial, unpaid } = data.paymentStatus;
        this.paymentStatusData.set([
          { name: this.i18n.t('payment.paid'), value: paid, color: themeColor('--success') },
          { name: this.i18n.t('payment.partial'), value: partial, color: themeColor('--warning') },
          { name: this.i18n.t('payment.unpaid'), value: unpaid, color: themeColor('--destructive') },
        ]);
        this.totalUnits.set(paid + partial + unpaid);
        this.buildCharts(data.monthly);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.title ?? this.i18n.t('common.error'));
        this.loading.set(false);
      },
    });
  }

  private buildCharts(monthlyData: MonthlyCollection[]): void {
    Chart.defaults.font.family = "'Noto Sans Arabic', sans-serif";

    const success = themeColor('--success');
    const primary = themeColor('--primary');
    const border = themeColor('--border');
    const mutedForeground = themeColor('--muted-foreground');
    const card = themeColor('--card');

    // التحصيل الشهري (Area Chart)
    const areaCtx = this.areaCanvas().nativeElement.getContext('2d')!;
    const gradient = areaCtx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, themeColor('--success', 0.3));
    gradient.addColorStop(1, themeColor('--success', 0));

    this.areaChart = new Chart(areaCtx, {
      type: 'line',
      data: {
        labels: monthlyData.map((d) => d.month),
        datasets: [
          {
            label: this.i18n.t('dashboard.collected'),
            data: monthlyData.map((d) => d.collected),
            borderColor: success,
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: this.i18n.t('dashboard.target'),
            data: monthlyData.map((d) => d.target),
            borderColor: primary,
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: {
            rtl: true,
            textDirection: 'rtl',
            backgroundColor: card,
            titleColor: mutedForeground,
            bodyColor: mutedForeground,
            borderColor: border,
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (item) => `${item.dataset.label}: ${(item.parsed.y ?? 0).toLocaleString('ar-EG')} ${this.i18n.t('common.egp')}`,
            },
          },
        },
        scales: {
          x: {
            reverse: true,
            grid: { display: false },
            ticks: { color: mutedForeground, font: { size: 12 } },
            border: { display: false },
          },
          y: {
            grid: { color: border },
            ticks: {
              color: mutedForeground,
              font: { size: 12 },
              callback: (value) => `${Number(value) / 1000}K`,
            },
            border: { display: false, dash: [3, 3] },
          },
        },
      },
    });

    // حالة السداد (Doughnut Chart)
    const pieCtx = this.pieCanvas().nativeElement.getContext('2d')!;
    this.pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: this.paymentStatusData().map((d) => d.name),
        datasets: [
          {
            data: this.paymentStatusData().map((d) => d.value),
            backgroundColor: this.paymentStatusData().map((d) => d.color),
            borderWidth: 0,
            spacing: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          tooltip: {
            rtl: true,
            textDirection: 'rtl',
            backgroundColor: card,
            bodyColor: mutedForeground,
            borderColor: border,
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (item) => `${item.label}: ${item.parsed} ${this.i18n.t('apartments.unit')}`,
            },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.areaChart?.destroy();
    this.pieChart?.destroy();
  }
}
