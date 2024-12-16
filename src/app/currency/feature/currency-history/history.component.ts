import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { HistoryService } from "../../data-access/history.service";
import { CurrencyHistoryTableComponent } from "../../ui/currency-history-table/currency-history-table.component";

@Component({
  selector: "app-history",
  imports: [CurrencyHistoryTableComponent],
  templateUrl: "./history.component.html",
  styleUrl: "./history.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyHistoryComponent {
  #historyService = inject(HistoryService);

  dataSource = this.#historyService.getRecordHistory();

  displayedColumns: string[] = [
    "amount",
    "base",
    "date",
    "rates",
    "convertedValue",
  ];
}
