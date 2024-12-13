import { CurrencyPipe, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { CurrencyConvertPipe } from "../shared/currency-convert.pipe";
import { HistoryService } from "./data-access/history.service";

@Component({
  selector: "app-history",
  imports: [
    MatTableModule,
    DatePipe,
    CurrencyConvertPipe,
    CurrencyPipe,
  ],
  templateUrl: "./history.component.html",
  styleUrl: "./history.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent {
  #historyService = inject(HistoryService);

  recordHistory = this.#historyService.getRecordHistory();

  displayedColumns: string[] = [
    "amount",
    "base",
    "date",
    "rates",
    "convertedValue",
  ];
}
