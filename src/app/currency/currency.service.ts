import { inject, Injectable } from "@angular/core";
import {
  HistoryRecord,
  HistoryService,
} from "../history/data-access/history.service";

@Injectable({ providedIn: "root" })
export class CurrencyService {
  #historyService = inject(HistoryService);

  getAmountHistory(): number {
    const record = this.getRecordHistory();
    return record?.amount || 1;
  }
  getFormHistory() {
    return {
      ...this.getConvertHistory(),
      amount: this.getAmountHistory(),
    };
  }

  getConvertHistory() {
    const record = this.getRecordHistory();
    return record
      ? {
          from: record?.base,
          to: record?.rates[0].code,
        }
      : {
          from: "",
          to: "",
        };
  }

  getRecordHistory(): HistoryRecord | null {
    return this.#historyService.getSessionRecordHistory();
  }

}
