import { isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import { Chart, ChartItem, ChartTypeRegistry, registerables } from "chart.js";

@Component({
  selector: "app-chart",
  imports: [],
  templateUrl: "./chart.component.html",
  styleUrl: "./chart.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {

  #chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#FFFFFF",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#FFFFFF",
        },
        grid: {
          color: "#666666",
        },
      },
      y: {
        ticks: {
          color: "#FFFFFF",
        },
        grid: {
          color: "#666666",
        },
      },
    },
  };

  platformId = inject(PLATFORM_ID);

  chartCanvas = viewChild("currencyChart", { read: ElementRef });
  chartRef = signal<Chart<keyof ChartTypeRegistry, number[], string> | null>(
    null
  );

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        Chart.register(...registerables);
        const canvas = this.chartCanvas();
        const chartRef = untracked(() => this.chartRef());

        if (chartRef === null) {
          const chart = this.createChart("line", canvas?.nativeElement);
          this.chartRef.set(chart);
        }
      }
    });
  }

  createChart(
    type: keyof ChartTypeRegistry,
    item: ChartItem
  ): Chart<keyof ChartTypeRegistry, number[], string> {
    return new Chart(item, {
      type,

      data: {
        // values on X-Axis
        labels: [
          "2022-05-10",
          "2022-05-11",
          "2022-05-12",
          "2022-05-13",
          "2022-05-14",
          "2022-05-15",
          "2022-05-16",
          "2022-05-17",
        ],

        datasets: [
          {
            label: "EUR Rates",
            data: [0.91, 0.92, 0.93, 0.94],
            borderColor: "#810081", // Green
            backgroundColor: "rgba(51, 255, 87, 0.2)", // Transparent green fill
            pointBackgroundColor: "#810081",
            pointBorderColor: "#FFFFFF",
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        ...this.#chartOptions,
      },
    });
  }
}
