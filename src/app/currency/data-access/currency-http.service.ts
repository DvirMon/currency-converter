import { Injectable, resource, ResourceRef, Signal } from "@angular/core";
import { oneWeekAgo } from "../../shared/utils/one-week-ago";
import {
  CurrencyList,
  ExchangeRateRangeResponse,
  ExchangeRatesResponse,
} from "./currency.model";

@Injectable({ providedIn: "root" })
export class CurrencyHttpService {
  #currencyListResource = this.fetchCurrencyList();

  getCurrencyList(): ResourceRef<CurrencyList> {
    return this.#currencyListResource;
  }

  //TODO - refactor with inject

  #BASE_URL = "https://api.frankfurter.dev/v1";

  fetchChartData(
    symbols: Signal<string>
  ): ResourceRef<ExchangeRateRangeResponse> {
    // const { from, to } = symbols;
    return resource({
      request: () => ({ symbols: symbols() }),
      loader: async ({ request }) => {
        const date = oneWeekAgo();
        const symbols = request.symbols;
        const url = `${this.#BASE_URL}/${date}..?&symbols=${symbols}`;
        const data = await fetch(url).then((res) => res.json());
        return data;
      },
    });
  }


  fetchCurrencyList(): ResourceRef<CurrencyList> {
    return resource({
      loader: async () => {
        const response = await fetch(`${this.#BASE_URL}/currencies`).then(
          (res) => res.json()
        );
        return response;
      },
    });
  }

  fetchCurrencyRates(
    symbols: Signal<{ from: string; to: string } | undefined>
  ): ResourceRef<ExchangeRatesResponse> {
    return resource({
      request: () => ({
        params: symbols(),
      }),
      loader: async ({ request }) => {
        if (request.params) {
          const { to, from } = request.params;
          const data = await fetch(
            `${this.#BASE_URL}/latest?base=${from}&symbols=${to}`
          ).then((res) => res.json());
          return data;
        }
      },
    });
  }
}
