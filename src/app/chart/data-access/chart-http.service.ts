import { Injectable, resource, ResourceRef, Signal } from "@angular/core";
import { oneWeekAgo } from "../utils/one-week-ago";

export interface ExchangeRateRangeResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: {
    [date: string]: {
      [currency: string]: number;
    };
  };
}

@Injectable({
  providedIn: "root",
})
export class ChartHttpService {
  BASE_URL = "https://api.frankfurter.dev/v1";


  fetchChartData(
    symbols: Signal<{ from: string; to: string }>
  ): ResourceRef<ExchangeRateRangeResponse> {
    // const { from, to } = symbols;
    return resource({
      request: () => ({ params: symbols() }),
      loader: async ({ request }) => {
        const date = oneWeekAgo();
        const { to, from } = request.params;
        const url = `${this.BASE_URL}/${date}?base=${from}&symbols=${to}`;
        const data = await fetch(url).then((res) => res.json());
        return data;
      },
    });
  }
}

