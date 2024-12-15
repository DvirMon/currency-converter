import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CurrencyHttpService } from "./data-access/currency-http.service";
import { CurrencyFormService } from "./ui/currency-form/currency-form.service";

import {
  HistoryRecord,
  HistoryService,
} from "../history/data-access/history.service";
import {
  ExchangeRateRangeResponse,
  ExchangeRatesResponse,
} from "./data-access/currency.model";
import { CurrencyFormComponent } from "./ui/currency-form/currency-form.component";
import { CurrencyLineChartComponent } from "./ui/currency-line-chart/currency-line-chart.component";
import { CurrencyResultComponent } from "./ui/currency-result/currency-result.component";
import { StorageService } from "../shared/services/storage.service";
import { SESSION_KEYS } from "../shared/services/storage.keys";
import { toObservable } from "@angular/core/rxjs-interop";
import { CurrencyService } from "./currency.service";

@Component({
  selector: "app-currency",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    CurrencyFormComponent,
    CurrencyResultComponent,
    CurrencyLineChartComponent,
  ],
  templateUrl: "./currency.component.html",
  styleUrl: "./currency.component.scss",
  host: { ngSkipHydration: "true" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyFormService],
})
export class CurrencyComponent {
  #currencyHttpService = inject(CurrencyHttpService);
  #historyService = inject(HistoryService);
  #currencyService = inject(CurrencyService);


  currencyResource = this.#currencyHttpService.getCurrencyList();

  convertTrigger = signal<
    | {
        from: string;
        to: string;
      }
    | undefined
  >(undefined);

  amount = signal<number>(this.#currencyService.getAmountHistory());

  selectedCurrencySymbol = signal<string>("USD");

  currencyListResource = this.#currencyHttpService.getCurrencyList();

  ratesResource = this.#currencyHttpService.fetchCurrencyRates(
    this.convertTrigger
  );

  currencyRatesResource = this.#currencyHttpService.fetchChartData(
    this.selectedCurrencySymbol
  );

  to = computed(() => {
    const data = this.convertTrigger();
    return data ? data.to : "USD";
  });

  historyRecord = computed(() => {
    const data = this.ratesResource.value();
    const amount = this.amount();

    if (data && amount) {
      const record = { ...data, amount };
      return this.#transformSourceToHistory(record);
    }

    return null;
  });

  // historyRecordChanged$ = toObservable(this.historyRecord);

  constructor() {
    // effect(() => {
    //   const data = this.ratesResource.value();
    //   const amount = this.amount();
    //   if (data && amount) {
    //     console.log("emit history");
    //     const record = { ...data, amount };
    //     this.#historyService.updateRecordHistory(
    //       this.#transformSourceToHistory(record)
    //     );
    //   }
    // });
    // effect(() => {
    //   const record = this.historyRecord();
    //   if (record) {
    //     console.log("emit history");
    //     this.#historyService.updateRecordHistory(record);
    //   }
    // });
  }

  onConvertChanged(
    event:
      | {
          from: string;
          to: string;
        }
      | undefined
  ) {
    if (event) {
      console.log("selection changed", event);
      this.convertTrigger.update(() => ({ ...event }));
    }
    // this.updateHistory();
  }

  onAmountChanged(amount: number) {
    console.log("amount changed", amount);
    this.amount.set(amount);
    // this.updateHistory();
  }

  onCurrencySelectionChanged(symbol: string) {
    this.selectedCurrencySymbol.set(symbol);
  }

  #transformSourceToHistory(source: ExchangeRatesResponse): HistoryRecord {
    return {
      amount: source.amount,
      base: source.base,
      date: source.date,
      rates: Object.entries(source.rates).map(([code, value]) => ({
        code,
        value,
      })),
    };
  }

  updateHistory() {
    const record = this.historyRecord();
    console.log(record);
    if (record) {
      console.log("emit history");
      this.#historyService.updateRecordHistory(record);
    }
  }
}
