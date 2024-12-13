import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CurrencyHttpService } from "./data-access/currency-http.service";
import { CurrencyFormService } from "./ui/currency-form/currency-form.service";

import { JsonPipe } from "@angular/common";
import {
  HistoryRecord,
  HistoryService,
} from "../history/data-access/history.service";
import { CurrencyFormComponent } from "./ui/currency-form/currency-form.component";
import { CurrencyResultComponent } from "./ui/currency-result/currency-result.component";
import { ExchangeRatesResponse } from "./data-access/currency.model";

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

  amount = signal<number>(0);

  ratesResource = this.#currencyHttpService.fetchCurrencyRates(
    this.convertTrigger
  );

  rate = computed(() => this.ratesResource.value()?.rates);

  to = computed(() => {
    const data = this.convertTrigger();
    return data ? data.to : "USD";
  });

  // history = computed(() => {});

  constructor() {
    effect(() => {
      const data = this.ratesResource.value();
      const amount = this.amount();

      if (data && amount) {
        const record = { ...data, amount };
        console.info("history", record);
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

  #transformSourceToHistory(source: ExchangeRatesResponse): HistoryRecord {
    return {
      amount: source.amount,
      base: source.base,
      date: source.date,
      rates: Object.entries(source.rates), // Convert Record to array of tuples
    };
  }
}
