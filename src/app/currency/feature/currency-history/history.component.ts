import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { HistoryService } from "../../data-access/history.service";
import { CurrencyHistoryTableComponent } from "../../ui/currency-history-table/currency-history-table.component";
import { CurrencyRecordCardComponent } from "../../ui/currency-record-card/currency-record-card.component";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { toSignal } from "@angular/core/rxjs-interop";
import { Observable, map, shareReplay } from "rxjs";

@Component({
  selector: "app-history",
  imports: [CurrencyHistoryTableComponent, CurrencyRecordCardComponent],
  templateUrl: "./history.component.html",
  styleUrl: "./history.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyHistoryComponent {
  #historyService = inject(HistoryService);

  #breakpointObserver = inject(BreakpointObserver);

  #isHandset$: Observable<boolean> = this.#breakpointObserver
    .observe([Breakpoints.Handset, Breakpoints.Small])
    .pipe(map((result) => result.matches));

  isHandset = toSignal(this.#isHandset$);

  dataSource = this.#historyService.getRecordHistory();

  displayedColumns: string[] = [
    "amount",
    "base",
    "date",
    "rates",
    "convertedValue",
  ];
}
