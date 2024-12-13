import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CurrencyHttpService } from "./data-access/currency-http.service";
import { CurrencyFormService } from "./ui/currency-form/currency-form.service";

import { JsonPipe } from "@angular/common";
import { HistoryService } from "../history/data-access/history.service";
import { CurrencyFormComponent } from "./ui/currency-form/currency-form.component";
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
    JsonPipe,
    // AsyncPipe,
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


  rateHistory = this.#historyService.getRateHistory();

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

  to = computed(() => this.convertTrigger()?.to);

  onConvertChanged(
    event:
      | {
          from: string;
          to: string;
        }
      | undefined
  ) {
    console.log(event);
    if (event) {
      this.convertTrigger.update(() => ({ ...event }));
    }
  }

  onAmountChanged(amount: number) {
    this.amount.set(amount);
  }

  onRateChanged(rate: string) {
    this.#historyService.updateRateHistory(rate);
  }

}
