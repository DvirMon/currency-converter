import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HistoryService {
  #rateHistory = signal<string[]>([]);

  getRateHistory(): WritableSignal<string[]> {
    return this.#rateHistory;
  }

  updateRateHistory(record: string): void {
    this.#rateHistory.update((rateHistory) => [...rateHistory, record]);
  }
}
