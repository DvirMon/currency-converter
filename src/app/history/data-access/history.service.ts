import {
  effect,
  inject,
  Injectable,
  linkedSignal,
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

  #recordHistory = signal<HistoryRecord[]>(
    this.#storageService.getFromSession(this.#sessionKeys.HISTORY) || []
  );

  constructor() {
    effect(() => {
      this.#storageService.setToSession(
        this.#sessionKeys.HISTORY,
        this.#recordHistory()
      );
    });
  }

  updateRecordHistory(record: HistoryRecord): void {
    this.#recordHistory.update((recordHistory) =>
      this.#compareTo(recordHistory[recordHistory.length - 1], record)
        ? recordHistory
        : [...recordHistory, record]
    );
  }
  getRecordHistory(): WritableSignal<HistoryRecord[]> {
    return this.#recordHistory;
  }

  getSessionHistory(): HistoryRecord[] {
    const history = this.#storageService.getFromSession<HistoryRecord[]>(
      this.#sessionKeys.HISTORY
    );

    return !!history ? [...history] : [];
  }

  getSessionRecordHistory(): HistoryRecord | null {
    const historyRecords = this.getSessionHistory();
    if (historyRecords.length > 0) {
      return historyRecords[historyRecords.length - 1];
    }
    return null;
  }

  #compareTo(record1: HistoryRecord, record2: HistoryRecord): boolean {
    return JSON.stringify(record1) === JSON.stringify(record2);
  }
}
