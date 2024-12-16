import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Observable, map } from "rxjs";
import { CurrencyStore } from "../../data-access/currency.store";
import { CurrencyRecordCardComponent } from "../../ui/currency-record-card/currency-record-card.component";
import { CurrencyRecordTableComponent } from "../../ui/currency-record-table/currency-record-table.component";

@Component({
  selector: "app-currency-history",
  imports: [CurrencyRecordTableComponent, CurrencyRecordCardComponent],
  templateUrl: "./history.component.html",
  styleUrl: "./history.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyHistoryComponent {
  #storeService = inject(CurrencyStore);

  #breakpointObserver = inject(BreakpointObserver);

  #isHandset$: Observable<boolean> = this.#breakpointObserver
    .observe([Breakpoints.Handset, Breakpoints.Small])
    .pipe(map((result) => result.matches));

  isHandset = toSignal(this.#isHandset$);

  dataSource = this.#storeService.history;

  displayedColumns: string[] = [
    "amount",
    "base",
    "date",
    "rates",
    "convertedValue",
  ];
}
