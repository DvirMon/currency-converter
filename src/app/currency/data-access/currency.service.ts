import { Injectable, resource, ResourceRef } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CurrencyService {
  getCurrencyList(): ResourceRef<string[]> {
    return resource({
      loader: async () => {
        const list = await fetch(
          "https://openexchangerates.org/api/currencies.json"
        ).then((res) => res.json());

        return Object.keys(list);
      },
    });
  }
}
