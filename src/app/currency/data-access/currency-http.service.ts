import {
  resource,
  ResourceRef,
  Signal
} from "@angular/core";
import { ExchangeRatesResponse } from "./currency.model";

export class CurrencyHttpService {
  getCurrencyList(): ResourceRef<string[]> {
    return resource({
      loader: async () => {
        const response = await fetch(
          "https://api.frankfurter.dev/v1/latest"
        ).then((res) => res.json());
        return Object.keys(response.rates);
      },
    });
  }

  getCurrencyRates(
    reqData: Signal<{ from: string; to: string; amount: string } | undefined>
  ): ResourceRef<ExchangeRatesResponse> {
    return resource({
      request: reqData,
      loader: async (params) => {
        if (params?.request) {
          const { to, from } = params.request;

          const data = await fetch(
            `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`
          ).then((res) => res.json());
          console.log(data);
          return data;
        }
      },
    });
  }
}
