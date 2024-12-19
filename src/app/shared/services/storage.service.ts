import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { SessionKeys } from "./storage.keys";

type SessionKeysType = typeof SessionKeys[keyof typeof SessionKeys]

@Injectable({
  providedIn: "root",
})
export class StorageService {
  #platformId = inject(PLATFORM_ID);

  #idleCallbackMap: Map<string, number> = new Map();

  setToSession<T>(key: string, data: T): void {
    if (!isPlatformBrowser(this.#platformId)) {
      return;
    }
    this.#scheduleSaveToSession(key, data);
  }

  removeFromSession(key: string): void {
    if (!isPlatformBrowser(this.#platformId)) {
      return;
    }
    sessionStorage.removeItem(key);
  }

  getFromSession<T>(key: string): T | null {
    if (!isPlatformBrowser(this.#platformId)) {
      return null;
    }
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  #scheduleSaveToSession(key: string, data: unknown): void {
    const existingId = this.#idleCallbackMap.get(key);
    if (existingId !== undefined) {
      cancelIdleCallback(existingId);
    }

    const newId = requestIdleCallback(() => {
      sessionStorage.setItem(key, JSON.stringify(data));
    });

    this.#idleCallbackMap.set(key, newId);
  }
}
