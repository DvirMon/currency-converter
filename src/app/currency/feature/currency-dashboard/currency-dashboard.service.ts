import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { inject, Injectable } from "@angular/core";
import { filter, map, Observable, merge, shareReplay } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CurrencyDashboardService {
  #breakpointObserver = inject(BreakpointObserver);

  #createBreakpointStream(breakpoint: string): Observable<string> {
    return this.#breakpointObserver.observe([breakpoint]).pipe(
      filter((state) => state.matches),
      map(() => breakpoint)
    );
  }

  #smallBreakpoint$ = this.#createBreakpointStream(Breakpoints.Small);
  #xSmallBreakpoint$ = this.#createBreakpointStream(Breakpoints.XSmall);
  #WebLandscapeBreakpoint$ = this.#createBreakpointStream(
    Breakpoints.WebLandscape
  );

  #activeBreakpoint$: Observable<string> = merge(
    this.#smallBreakpoint$,
    this.#xSmallBreakpoint$,
    this.#WebLandscapeBreakpoint$
  ).pipe(shareReplay(1));

  // Define layout maps for each card
  card1Layout = new Map<string, { cols: number; rows: number }>([
    [Breakpoints.XSmall, { cols: 2, rows: 1 }],
    [Breakpoints.Small, { cols: 1, rows: 1 }],
    [Breakpoints.WebLandscape, { cols: 1, rows: 1 }],
  ]);

  card2Layout = new Map<string, { cols: number; rows: number }>([
    [Breakpoints.XSmall, { cols: 2, rows: 1 }],
    [Breakpoints.Small, { cols: 1, rows: 1 }],
    [Breakpoints.WebLandscape, { cols: 1, rows: 2 }],
  ]);

  card3Layout = new Map<string, { cols: number; rows: number }>([
    [Breakpoints.XSmall, { cols: 2, rows: 2 }],
    [Breakpoints.Small, { cols: 2, rows: 2 }],
    [Breakpoints.WebLandscape, { cols: 1, rows: 1 }],
  ]);

  // Card Observables
  card1$: Observable<{ cols: number; rows: number }> =
    this.#activeBreakpoint$.pipe(
      map((breakpoint) => this.card1Layout.get(breakpoint)!)
    );

  card2$: Observable<{ cols: number; rows: number }> =
    this.#activeBreakpoint$.pipe(
      map((breakpoint) => this.card2Layout.get(breakpoint)!)
    );

  card3$: Observable<{ cols: number; rows: number }> =
    this.#activeBreakpoint$.pipe(
      map((breakpoint) => this.card3Layout.get(breakpoint)!)
    );

  getActiveBreakpoint$(): Observable<string> {
    return this.#activeBreakpoint$;
  }
}
