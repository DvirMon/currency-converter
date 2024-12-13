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
import { CurrencyFormService } from "./ui/currency-form/currency-form.service";
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

  convertTrigger = signal<
    | {
        from: string;
        to: string;
      }
    | undefined
  >(undefined);

  amount = signal<number>(0);

  ratesResource = this.#currencyHttpService.getCurrencyRates(
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
