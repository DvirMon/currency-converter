import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ChartComponent } from "../../../shared/chart/chart.component";

@Component({
  selector: "app-currency-line-chart",
  imports: [ChartComponent],
  templateUrl: "./currency-line-chart.component.html",
  styleUrl: "./currency-line-chart.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyLineChartComponent {
  data = {
    labels: ["25 Nov", "5 Dec", "14 Dec"],
    datasets: [
      {
        label: "Exchange Rate",
        data: [64, 65, 67.27],

        borderColor: "#810081",
        backgroundColor: "rgba(129, 0, 129, 0.2)",
        pointBackgroundColor: "#810081",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      },
    ],
  };
}
