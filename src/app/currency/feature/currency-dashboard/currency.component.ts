import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
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
}
