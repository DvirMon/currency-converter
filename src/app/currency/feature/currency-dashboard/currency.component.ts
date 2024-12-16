import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CurrencyHttpService } from "../../data-access/currency-http.service";
import { CurrencyFormService } from "../../ui/currency-form/currency-form.service";

import { CurrencyStore } from "../../data-access/currency.store";
import { CurrencyFormComponent } from "../../ui/currency-form/currency-form.component";
import { CurrencyLineChartComponent } from "../../ui/currency-line-chart/currency-line-chart.component";
import { CurrencyResultComponent } from "../../ui/currency-result/currency-result.component";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { combineLatest, filter, map, tap } from "rxjs";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-currency-dashboard",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    CurrencyFormComponent,
    CurrencyResultComponent,
    CurrencyLineChartComponent,
    AsyncPipe,
  ],
  templateUrl: "./currency.component.html",
  styleUrl: "./currency.component.scss",
  host: { ngSkipHydration: "true" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyFormService],
})
export class CurrencyDashboardComponent {
  #currencyHttpService = inject(CurrencyHttpService);
  #currencyStore = inject(CurrencyStore);

  currencyListResource = this.#currencyHttpService.getCurrencyListResource();

  convert = this.#currencyStore.convert;

  amount = this.#currencyStore.amount;

  //TODO = add history
  selectedSymbol = this.#currencyStore.selectedSymbol;

  ratesResource = this.#currencyStore.ratesResource;

  chartRatesResource = this.#currencyStore.chartResource;

  to = computed(() => {
    const data = this.convert();
    return data ? data.to : "USD";
  });

  lastRate: number = 0;

  constructor() {
    effect(() => {
      console.log("to convert", this.to());
    });

    this.exchangeRate$.subscribe();
  }

  ratesValue = computed(() => this.ratesResource.value()?.rates);

  rate$ = toObservable(this.ratesValue).pipe(filter((value) => !!value));

  to$ = toObservable(this.to);

  exchangeRate$ = this.rate$.pipe(
    filter((rate) => !!rate),
    map((rate) => Object.values(rate)),
    // filter((value) => typeof value === "number"),
    // map(([key, value]) => value),
    map((values) => values[0]),
    tap((value) => console.log(value, "value"))
  );

  // exchangeRate$ = combineLatest([this.rate$, this.to$]).pipe(
  //   filter(([rate, to]) => !!rate && !!to),
  //   map(([rate, to]) => rate[to]),
  //   filter((value) => typeof value === "number"),
  //   tap((value) => console.log(value))
  // );

  // rates = toSignal(this.rate$);

  // exchangeRate = computed(() => {
  //   const rate = this.rates();
  //   const to = this.to();

  //   if (rate && to) {
  //     return rate[to];
  //   }
  //   return 0;
  // });
}
