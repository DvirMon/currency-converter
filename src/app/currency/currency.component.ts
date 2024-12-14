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

  rates: ExchangeRateRangeResponse = {
    amount: 1.0,
    base: "EUR",
    start_date: "2024-12-06",
    end_date: "2024-12-13",
    rates: {
      "2024-12-06": {
        USD: 1.0581,
      },
      "2024-12-09": {
        USD: 1.0568,
      },
      "2024-12-10": {
        USD: 1.0527,
      },
      "2024-12-11": {
        USD: 1.0507,
      },
      "2024-12-12": {
        USD: 1.0491,
      },
      "2024-12-13": {
        USD: 1.0518,
      },
    },
  };

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
        // console.info("history", record);
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
      // console.info("history trigger", event, this.amount());
      this.convertTrigger.update(() => ({ ...event }));
    }
  }

  onAmountChanged(amount: number) {
    // console.info("history amount", this.convertTrigger(), amount);
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
