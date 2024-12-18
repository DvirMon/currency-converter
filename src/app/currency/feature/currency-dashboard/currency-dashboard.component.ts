import { Component, computed, inject } from "@angular/core";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { map, shareReplay, tap } from "rxjs/operators";
import { AsyncPipe, NgTemplateOutlet } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { CurrencyHttpService } from "../../data-access/currency-http.service";
import { CurrencyStore } from "../../data-access/currency.store";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CurrencyFormComponent } from "../../ui/currency-form/currency-form.component";
import { CurrencyLineChartComponent } from "../../ui/currency-line-chart/currency-line-chart.component";
import { CurrencyResultComponent } from "../../ui/currency-result/currency-result.component";
import { CurrencyFormService } from "../../ui/currency-form/currency-form.service";
import { merge, Observable } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { CurrencyDashboardService } from "./currency-dashboard.service";

@Component({
  selector: "app-currency-dashboard",
  templateUrl: "./currency-dashboard.component.html",
  styleUrl: "./currency-dashboard.component.scss",
  standalone: true,
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    MatGridListModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    CurrencyFormComponent,
    CurrencyResultComponent,
    CurrencyLineChartComponent,
  ],
  providers: [CurrencyFormService],
})
export class CurrencyDashboardComponent {
  #currencyHttpService = inject(CurrencyHttpService);
  #dashboardService = inject(CurrencyDashboardService);
  #currencyStore = inject(CurrencyStore);
  #breakpointObserver = inject(BreakpointObserver);

  currencyListResource = this.#currencyHttpService.getCurrencyListResource();

  convert = this.#currencyStore.convert;

  amount = this.#currencyStore.amount;

  selectedSymbol = this.#currencyStore.selectedSymbol;

  ratesResource = this.#currencyStore.ratesResource;

  chartRatesResource = this.#currencyStore.chartResource;

  to = computed(() => {
    const data = this.convert();
    const { to } = data;
    return to;
  });

  // Card Observables
  card1$ = this.#dashboardService.card1$;
  card2$: Observable<{ cols: number; rows: number }> =
    this.#dashboardService.card2$;

  card3$: Observable<{ cols: number; rows: number }> =
    this.#dashboardService.card3$;

  isMatch$ = this.#breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

  isMatch = toSignal(this.isMatch$);
}
