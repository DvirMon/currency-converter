import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { SESSION_KEYS, SessionKeys } from "./storage.keys";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  platformId = inject(PLATFORM_ID);
  sessionKeys = inject(SESSION_KEYS);

  idleCallbackId: number | null = null;

  setToSession<T>(key: string, data: T): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.#scheduleSaveToSession(key, data);
  }

  removeFromSession(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    sessionStorage.removeItem(key);
  }

  getFromSession<T>(key: string): T | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  #scheduleSaveToSession(key: string, data: unknown): void {
    if (this.idleCallbackId !== null) {
      cancelIdleCallback(this.idleCallbackId);
    }

    this.idleCallbackId = requestIdleCallback(() => {
      sessionStorage.setItem(key, JSON.stringify(data));
    });
  }
}
