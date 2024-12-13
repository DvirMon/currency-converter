import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { HistoryService } from "./data-access/history.service";
import { JsonPipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";

@Component({
  selector: "app-history",
  imports: [JsonPipe, MatTableModule],
  templateUrl: "./history.component.html",
  styleUrl: "./history.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent {
  #historyService = inject(HistoryService);

  recordHistory = this.#historyService.getRecordHistory();
}
