import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CurrencyFormService } from "./data-access/currency-form.service";
import { CurrencyHttpService } from "./data-access/currency-http.service";

import { CurrencyPipe } from "@angular/common";
import { CurrencyFormComponent } from "./ui/currency-form/currency-form.component";
import { CurrencyResultComponent } from "./ui/currency-result/currency-result.component";
// import { HistoryService } from "../history/history.service";

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
    // JsonPipe,
    // AsyncPipe,
  ],
  templateUrl: "./currency.component.html",
  styleUrl: "./currency.component.scss",
  host: { ngSkipHydration: "true" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyHttpService, CurrencyFormService],
})
export class CurrencyComponent {
  #currencyHttpService = inject(CurrencyHttpService);
  // #historyService = inject(HistoryService);

  currencyResource = this.#currencyHttpService.getCurrencyList();

  convertWriteTrigger = signal<
    | {
        amount: string;
        from: string;
        to: string;
      }
    | undefined
  >(undefined);

  amount = signal<number>(0);

  onConvertChanged(
    event:
      | {
          amount: string;
          from: string;
          to: string;
        }
      | undefined
  ) {
    this.convertWriteTrigger.set(event);
  }

  onAmountChanged(amount: number) {
    this.amount.set(amount);
  }

  ratesResource = this.#currencyHttpService.getCurrencyRates(
    this.convertWriteTrigger
  );

  rate = computed(() => this.ratesResource.value()?.rates);

  // rateConverted = computed(() => {
  //   const rates = this.rate();
  //   const data = this.convertWriteTrigger();
  //   const amount = this.amount();

  //   if (rates && data) {
  //     const { to } = data;
  //     return this.#convert(rates, to, amount);
  //   }

  //   return "0";
  // });

  // #convert(rates: Record<string, number>, to: string, amount: number): string {
  //   return (amount * rates[to]).toFixed(2);
  // }


}
