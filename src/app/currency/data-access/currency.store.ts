import { inject, Injectable, signal } from "@angular/core";
import { HistoryService } from "./history.service";

@Injectable({ providedIn: "root" })
export class CurrencyStore {
  #historyService = inject(HistoryService);

  convert = signal<{
    from: string;
    to: string;
  }>(this.#historyService.getSessionConvertHistory());

  amount = signal<number>(this.#historyService.getSessionAmountHistory());

  selectedSymbol = signal<string>("USD");
}
