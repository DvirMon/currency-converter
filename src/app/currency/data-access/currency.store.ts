import {
  computed,
  effect,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from "@angular/core";
import { CurrencyHttpService } from "./currency-http.service";
import { ExchangeRatesResponse } from "./currency.model";
import { HistoryRecord, HistoryService } from "./history.service";

export interface TypedLinkedSignal {
  data: ExchangeRatesResponse | undefined;
  amount: number;
}
@Injectable({ providedIn: "root" })
export class CurrencyStore {
  #historyService = inject(HistoryService);
  #currencyHttpService = inject(CurrencyHttpService);

  convert = signal<{
    from: string;
    to: string;
  }>(this.#historyService.getSessionConvertHistory());

  amount = signal<number>(
    Number(this.#historyService.getSessionAmountHistory())
  );

  selectedSymbol = signal<string>(
    this.#historyService.geSessionSelectedSymbol()
  );

  ratesResource = this.#currencyHttpService.fetchCurrencyRates(this.convert);

  chartResource = this.#currencyHttpService.fetchChartData(this.selectedSymbol);

  // historyRecord = linkedSignal<TypedLinkedSignal, HistoryRecord | null>({
  //   source: () => ({ data: this.ratesResource.value(), amount: this.amount() }),
  //   computation: (params) => {
  //     const { amount, data } = params;
  //     if (data && amount) {
  //       return this.#transformSourceToHistory(amount, data);
  //     }
  //     return null;
  //   },
  // });

  historyRecord = linkedSignal({
    source: computed(() => ({
      data: this.ratesResource.value(),
      amount: this.amount(),
    })),
    computation: ({ data, amount }) => {
      if (data && amount) {
        return this.#transformSourceToHistory(amount, data);
      }
      return null;
    },
  });

  history = linkedSignal<HistoryRecord | null, HistoryRecord[]>({
    source: computed(() => this.historyRecord()),
    computation: (newRecord) => {
      const sessionHistory = this.#historyService.getSessionRecordHistory();

      const lastRecord = sessionHistory[sessionHistory.length - 1];

      if (newRecord && !this.#compareTo(lastRecord, newRecord)) {
        return [...sessionHistory, newRecord];
      }
      return sessionHistory;
    },
  });

  saveHistoryToSession = effect(() => {
    this.#historyService.setHistoryToSession(this.history());
  });

  saveSymbolToSession = effect(() => {
    this.#historyService.seSessionSelectedSymbol(this.selectedSymbol());
  });

  #transformSourceToHistory(
    amount: number,
    source: ExchangeRatesResponse
  ): HistoryRecord | null {
    if (source) {
      return {
        amount,
        base: source.base,
        date: source.date,
        rates: Object.entries(source.rates).map(([code, value]) => ({
          code,
          value,
        })),
      };
    }
    return null;
  }

  #compareTo(record1: HistoryRecord, record2: HistoryRecord): boolean {
    return JSON.stringify(record1) === JSON.stringify(record2);
  }
}