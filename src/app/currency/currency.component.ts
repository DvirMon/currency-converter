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
import { ExchangeRatesResponse } from "./data-access/currency.model";
import { CurrencyStore } from "./data-access/currency.store";
import { CurrencyFormComponent } from "./ui/currency-form/currency-form.component";
import { CurrencyLineChartComponent } from "./ui/currency-line-chart/currency-line-chart.component";
import { CurrencyResultComponent } from "./ui/currency-result/currency-result.component";
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


  convert = signal<{
    from: string;
    to: string;
  }>(this.#currencyService.getConvertHistory());

  amount = signal<number>(this.#currencyService.getAmountHistory());

  //TODO = add history
  selectedSymbol = signal<string>("USD");

  currencyListResource = this.#currencyHttpService.getCurrencyList();

  ratesResource = this.#currencyHttpService.fetchCurrencyRates(this.convert);

  currencyRatesResource = this.#currencyHttpService.fetchChartData(
    this.selectedSymbol
  );

  to = computed(() => {
    const data = this.convert();
    return data ? data.to : "USD";
  });

  historyRecord = computed(
    () => {
      const data = this.ratesResource.value();
      const amount = this.amount();

      if (data && amount) {
        return this.#transformSourceToHistory(amount, data);
      }
      return null
    },
  );

  // historyRecordChanged$ = toObservable(this.historyRecord);

  constructor() {
    effect(() => {
      const record = this.historyRecord();
      if (record) {
        this.#historyService.updateRecordHistory(record);
      }
    });
  }

  // onCurrencySelectionChanged(symbol: string) {
  //   this.selectedCurrencySymbol.set(symbol);
  // }

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


}
