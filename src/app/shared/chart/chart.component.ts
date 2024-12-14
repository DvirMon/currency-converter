import { isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import {
  Chart,
  ChartData,
  ChartItem,
  ChartOptions,
  ChartTypeRegistry,
  registerables,
} from "chart.js";

@Component({
  selector: "app-chart",
  imports: [],
  templateUrl: "./chart.component.html",
  styleUrl: "./chart.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  platformId = inject(PLATFORM_ID);

  chartData = input.required<ChartData | undefined>();
  type = input<keyof ChartTypeRegistry>("line");

  chartCanvas = viewChild("currencyChart", { read: ElementRef });

  chartRef = signal<Chart<keyof ChartTypeRegistry, unknown[], unknown> | null>(
    null
  );

  chartOptions = input<ChartOptions>({
    aspectRatio: 2.5,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        // TODO - check callbacks api
        enabled: true,
        // callbacks: {
        //   label: function (context: { raw: string; label: string }) {
        //     // Customize tooltip text
        //     return `${context.raw} on ${context.label}`;
        //   },
        // },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#FFFFFF",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        ticks: {
          color: "#FFFFFF",
        },
      },
    },
  });

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        Chart.register(...registerables);
        const canvas = this.chartCanvas();
        const chartRef = untracked(() => this.chartRef());
        const type = this.type();
        const data = this.chartData();
        const options = this.chartOptions();

        if (chartRef === null && data) {
          const chart = this.createChart(canvas?.nativeElement, {
            type,
            data,
            options,
          });
          this.chartRef.set(chart);
        }

        if (chartRef && data) {
          chartRef.destroy();
          const chart = this.createChart(canvas?.nativeElement, {
            type,
            data,
            options,
          });
          this.chartRef.set(chart);
        }
      }
    });
  }

  createChart(
    item: ChartItem,
    config: {
      type: keyof ChartTypeRegistry;
      data: ChartData;
      options?: ChartOptions;
    }
  ): Chart<keyof ChartTypeRegistry, unknown[], unknown> {
    const { type, data, options } = config;

    return new Chart(item, {
      type,

      data: {
        ...data,
      },
      options: {
        ...options,
      },
    });
  }
}
