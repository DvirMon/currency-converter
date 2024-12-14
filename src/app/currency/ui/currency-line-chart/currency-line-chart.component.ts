import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Signal,
} from "@angular/core";
import { ChartComponent } from "../../../shared/chart/chart.component";
import { ExchangeRateRangeResponse } from "../../data-access/currency.model";
import { ChartData } from "chart.js";
import { JsonPipe } from "@angular/common";

@Component({
  selector: "app-currency-line-chart",
  imports: [ChartComponent, JsonPipe],
  templateUrl: "./currency-line-chart.component.html",
  styleUrl: "./currency-line-chart.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyLineChartComponent {
  currencyRate = input.required<ExchangeRateRangeResponse | undefined>();

  styleConfig: { [key: string]: Record<string, unknown> } = {
    USD: {
      // TODO - refactor to get randoms color
      borderColor: "#810081",
      backgroundColor: "rgba(129, 0, 129, 0.2)",
      pointBackgroundColor: "#810081",
      pointBorderColor: "rgba(255, 255, 255, 1)",
      pointRadius: 5,
      pointHoverRadius: 7,
      fill: true,
      tension: 0.4,
    },
  };

  data: Signal<ChartData | undefined> = computed(() => {
    const response = this.currencyRate();

    if (response) {
      return this.#mapRatesToChartData(response);
    }

    return undefined;
  });

  // TODO - refactor to handle multiple currencies
  #mapRatesToChartData(response: ExchangeRateRangeResponse) {
    const labels = Object.keys(response.rates);

    const firstDateRates = response.rates[labels[0]];
    const currency = Object.keys(firstDateRates)[0];

    const data = labels.map((date) => response.rates[date][currency]);

    return {
      labels,
      datasets: [
        {
          label: `${currency} Exchange Rate`,
          data,
          ...this.styleConfig["USD"],
        },
      ],
    };
  }
}
