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
      const history = this.#recordHistory();
      // this.#storageService.setToSession(this.#sessionKeys.HISTORY, history);
    });
  }

  updateRecordHistory(record: HistoryRecord): void {
    this.#recordHistory.update((recordHistory) => [...recordHistory, record]);
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
}
