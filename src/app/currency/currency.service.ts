import { inject, Injectable } from "@angular/core";
import {
    HistoryService
} from "../history/data-access/history.service";

@Injectable({ providedIn: "root" })
export class CurrencyService {
  #historyService = inject(HistoryService);

  getAmountHistory(): number {
    const historyRecords = this.#historyService.getSessionHistory();
    if (historyRecords.length > 0) {
      const record = historyRecords[historyRecords.length - 1];
      return record?.amount;
    }
    return 1;
  }
}
