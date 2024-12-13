import { Injectable, resource, ResourceRef, Signal } from "@angular/core";
import { ExchangeRatesResponse } from "./currency.model";

@Injectable({ providedIn: "root" })
export class CurrencyHttpService {
  #currencyListResource = this.fetchCurrencyList();

  getCurrencyList() {
    return this.#currencyListResource;
  }

  called = 1;

  fetchCurrencyList(): ResourceRef<string[]> {
    return resource({
      loader: async () => {
        const response = await fetch(
          "https://api.frankfurter.dev/v1/latest"
        ).then((res) => res.json());
        return Object.keys(response.rates);
      },
    });
  }

  fetchCurrencyRates(
    params: Signal<{ from: string; to: string } | undefined>
  ): ResourceRef<ExchangeRatesResponse> {
    return resource({
      request: () => ({
        params: params(),
      }),
      loader: async ({ request }) => {

        console.info("currency rates called", this.called); ;
        ++this.called;
        if (request.params) {
          const { to, from } = request.params;
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
