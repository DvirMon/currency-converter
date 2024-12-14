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

  currencyResource = this.#currencyHttpService.getCurrencyList();

  convertTrigger = signal<
    | {
        from: string;
        to: string;
      }
    | undefined
  >(undefined);

  amount = signal<number>(1);

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

  constructor() {
    effect(() => {
      const data = this.ratesResource.value();
      const amount = this.amount();

      if (data && amount) {
        const record = { ...data, amount };
        this.#historyService.updateRecordHistory(
          this.#transformSourceToHistory(record)
        );
      }
    });
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
      this.convertTrigger.update(() => ({ ...event }));
    }
  }

  onAmountChanged(amount: number) {
    this.amount.set(amount);
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
}
