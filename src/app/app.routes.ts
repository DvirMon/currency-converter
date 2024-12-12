import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./currency/currency.component").then((m) => m.CurrencyComponent),
  },

  {
    path: "history",
    loadComponent: () =>
      import("./history/history.component").then((m) => m.HistoryComponent),
  },

  {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  },
];
