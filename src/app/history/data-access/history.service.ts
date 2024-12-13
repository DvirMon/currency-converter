import { Injectable, signal, WritableSignal } from "@angular/core";

export interface HistoryRecord {
  amount: number;
  base: string;
  date: string;
  rates: [string, number][];
}
@Injectable({
  providedIn: "root",
})
export class HistoryService {
  #recordHistory = signal<HistoryRecord[]>([]);

  updateRecordHistory(record: HistoryRecord): void {
    this.#recordHistory.update((recordHistory) => [...recordHistory, record]);
  }
  getRecordHistory(): WritableSignal<HistoryRecord[]> {
    return this.#recordHistory;
  }


}
