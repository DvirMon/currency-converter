import { inject, Injectable, signal } from "@angular/core";
import { CurrencyService } from "../currency.service";

@Injectable({ providedIn: "root" })
export class CurrencyStore {
  #currencyService = inject(CurrencyService);

  convert = signal<{
    from: string;
    to: string;
  }>(this.#currencyService.getConvertHistory());

  amount = signal<number>(this.#currencyService.getAmountHistory());
}
