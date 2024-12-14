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

  #recordHistory = signal<HistoryRecord[]>(
    this.#storageService.getFromSession(this.#sessionKeys.HISTORY) || []
  );

  constructor() {
    effect(() => {
      this.#saveToSession();
    });
  }

  updateRecordHistory(record: HistoryRecord): void {
    this.#recordHistory.update((recordHistory) => [...recordHistory, record]);
  }
  getRecordHistory(): WritableSignal<HistoryRecord[]> {
    return this.#recordHistory;
  }

  #saveToSession() {
    this.#storageService.setToSession(
      this.#sessionKeys.HISTORY,
      this.#recordHistory()
    );
  }
}
