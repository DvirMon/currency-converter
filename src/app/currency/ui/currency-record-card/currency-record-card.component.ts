import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { HistoryRecord } from "../../data-access/history.service";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { CurrencyConvertPipe } from "../../utils/currency-convert.pipe";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-currency-record-card",
  imports: [
    MatCardModule,
    MatListModule,
    DatePipe,
    CurrencyPipe,
    CurrencyConvertPipe,
  ],
  templateUrl: "./currency-record-card.component.html",
  styleUrl: "./currency-record-card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyRecordCardComponent {
  record = input.required<HistoryRecord>();
}
