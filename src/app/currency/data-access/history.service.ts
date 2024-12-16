import {
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from "@angular/core";
import { SESSION_KEYS } from "../../shared/services/storage.keys";
import { StorageService } from "../../shared/services/storage.service";

export interface HistoryRecord {
  amount: number;
  base: string;
  date: string;
  rates: { code: string; value: number }[];
}
@Injectable({
  providedIn: "root",
})
export class HistoryService {
  #storageService = inject(StorageService);

  #sessionKeys = inject(SESSION_KEYS);

  setHistoryToSession(history: HistoryRecord[]): void {
    this.#storageService.setToSession(this.#sessionKeys.HISTORY, history);
  }

  getSessionRecordHistory(): HistoryRecord[] {
    const history = this.#storageService.getFromSession<HistoryRecord[]>(
      this.#sessionKeys.HISTORY
    );
    return !!history ? [...history] : [];
  }

  seSessionSelectedSymbol(currency: string): void {
    this.#storageService.setToSession(
      this.#sessionKeys.LAST_SELECTED_CURRENCY,
      currency
    );
  }

  geSessionSelectedSymbol() {
    const lastSelected = this.#storageService.getFromSession<string>(
      this.#sessionKeys.LAST_SELECTED_CURRENCY
    );

    return lastSelected || "USD";
  }

  #getSessionRecordHistory(): HistoryRecord | null {
    const historyRecords = this.getSessionRecordHistory();
    if (historyRecords.length > 0) {
      return historyRecords[historyRecords.length - 1];
    }
    return null;
  }

  getSessionAmountHistory(): number {
    const record = this.#getSessionRecordHistory();
    return record?.amount || 1;
  }
  getSessionFormHistory() {
    return {
      ...this.getSessionConvertHistory(),
      amount: this.getSessionAmountHistory(),
    };
  }

  getSessionConvertHistory() {
    const record = this.#getSessionRecordHistory();
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
}
