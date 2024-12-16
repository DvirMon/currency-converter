import { Component, computed, inject } from "@angular/core";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { map, shareReplay } from "rxjs/operators";
import { AsyncPipe } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { CurrencyHttpService } from "../currency/data-access/currency-http.service";
import { CurrencyStore } from "../currency/data-access/currency.store";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CurrencyFormComponent } from "../currency/ui/currency-form/currency-form.component";
import { CurrencyLineChartComponent } from "../currency/ui/currency-line-chart/currency-line-chart.component";
import { CurrencyResultComponent } from "../currency/ui/currency-result/currency-result.component";
import { CurrencyFormService } from "../currency/ui/currency-form/currency-form.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-currency-dashboard",
  templateUrl: "./currency-dashboard.component.html",
  styleUrl: "./currency-dashboard.component.scss",
  standalone: true,
  imports: [
    AsyncPipe,
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

  isMatch$ = this.#breakpointObserver
    .observe([Breakpoints.Handset, Breakpoints.Small])
    .pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

  card1$: Observable<{ cols: number; rows: number }> = this.isMatch$.pipe(
    map((isMatch) => {
      if (isMatch) {
        return { cols: 2, rows: 1 };
      } else {
        return { cols: 1, rows: 1 };
      }
    })
  );
  card2$: Observable<{ cols: number; rows: number }> = this.isMatch$.pipe(
    map((isMatch) => {
      if (isMatch) {
        return { cols: 2, rows: 1 };
      } else {
        return { cols: 1, rows: 2 };
      }
    })
  );
  card3$: Observable<{ cols: number; rows: number }> = this.isMatch$.pipe(
    map((isMatch) => {
      if (isMatch) {
        return { cols: 2, rows: 1 };
      } else {
        return { cols: 1, rows: 1 };
      }
    })
  );
}
